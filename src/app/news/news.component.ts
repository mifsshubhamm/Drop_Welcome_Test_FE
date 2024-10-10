import { Component, DestroyRef, ElementRef, HostListener, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { NewsService } from '../shared/service/news.service';
import { News } from '../shared/model/news.model';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../shared/pipe/time.ago/time-ago.pipe';

/**
 * @component NewsComponent
 * 
 * The `NewsComponent` is a standalone Angular component that fetches and displays
 * news stories. It implements infinite scrolling to load more stories as the user
 * scrolls down the page. The component uses signals for state management and
 * includes keyboard navigation for accessibility.
 * 
 * @import { CommonModule } from '@angular/common'
 * @import { TimeAgoPipe } from '../time-ago.pipe'
 * @import { NewsService } from '../shared/service/news.service'
 * @import { News } from '../shared/model/news.model'
 * 
 * @selector app-news
 * 
 * @templateUrl ./news.component.html
 * @styleUrl ./news.component.css
 */


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule,TimeAgoPipe],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {


  public readonly newsService: NewsService;

  public readonly destroyRef = inject(DestroyRef)

  constructor(newsService: NewsService, destroyRef: DestroyRef) {
      this.newsService = newsService; // Initialized in the constructor
      this.destroyRef = destroyRef
  }

  /**
   * @public stories
   * @type {Signal<number[]>}
   * 
   * A signal representing an array of story IDs fetched from the news API.
   */
   stories = signal<number[]>([]);

  /**
   * @public newsList
   * @type {Signal<News[]>}
   * 
   * A signal representing an array of news articles currently displayed in the component.
   */
  newsList = signal<News[]>([]);

  /**
   * @public loaderItem
   * @type {number}
   * 
   * The number of items to load at a time; initially set to 20.
   */
  loaderItem:number = 20;

  /**
   * @method ngOnInit
   * 
   * Angular lifecycle hook that initializes the component.
   * It subscribes to the news service to fetch all stories id and
   * subsequently fetches individual news articles.
   */
  ngOnInit(): void {
    const subscription = this.newsService.getStoriesId().subscribe({
      next: (responseData) => {
        this.stories.set(responseData as  number[])
      },
      complete: () => {        
        this.getStoryDetailsApi()
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }


  /**
   * @method getStoryDetailsApi
   * 
   * Fetches a single news feed article based on the current index from the story list.
   * Continues to fetch articles until the specified number of items are loaded.
   */
  getStoryDetailsApi() {
    const stories = this.newsList();
    const size = stories.length;
    const subscription = this.newsService.getStoryDetails(this.getStoryAtIndex(size)).subscribe({
      next: (responseData) => {
        const currentStories = this.newsList();
      this.newsList.set([...currentStories, responseData]);
      },
      complete: () => {
          if(size < this.loaderItem-1) {
            this.getStoryDetailsApi()
          }
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  /**
   * @method getStoryAtIndex
   * @param {number} index - The index of the story to retrieve.
   * @returns {number} The story ID at the specified index.
   */
  getStoryAtIndex(index: number): number {
    const stories = this.stories();
    return stories[index];
  }

 @ViewChildren('itemElement') itemElements!: QueryList<ElementRef>;

 /**
   * @method checkLastItemVisibility
   * 
   * Checks if the last item in the news list is visible in the viewport.
   * If it is visible and the number of loaded stories meets the threshold,
   * it fetches more news articles.
   */
    checkLastItemVisibility() {

      if (this.itemElements && this.itemElements.length > 0) {
        const lastItem = this.itemElements.last.nativeElement;
        
        const { top, bottom } = lastItem.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const isVisible = top >= 0 && bottom <= windowHeight;
        const stories = this.newsList();
        const size = stories.length;

        const storiesID = this.stories();
        const idListsize = storiesID.length;

        if(isVisible && size == this.loaderItem && this.loaderItem < idListsize) {
            if(this.loaderItem+10 <= idListsize) {
              this.loaderItem+=10
            } else {
              this.loaderItem=this.loaderItem + idListsize-this.loaderItem
            }
            this.getStoryDetailsApi()
        }
    } 
  
  }

  /**
   * @method clickNews
   * @param {News} news - The news article to open.
   * 
   * Opens the news article URL in a new tab.
   */
  clickNews(news: News): void {
    if(news.url != null) {
      window.open(news.url, "_blank")
    }
  }


/**
   * @method handleKeyDown
   * @param {KeyboardEvent} event - The keyboard event triggered.
   * @param {News} news - The news article associated with the event.
   * 
   * Handles keyboard navigation; opens the news article if Enter or Space is pressed.
   */
  handleKeyDown(event: KeyboardEvent, news: News) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.clickNews(news);
    }
}

 /**
   * @method ngAfterViewInit
   * 
   * Angular lifecycle hook that runs after the component's view has been initialized.
   * It checks the visibility of the last item in the news list.
   */
  ngAfterViewInit() {
    this.checkLastItemVisibility();
  }

  /**
   * @method onWindowScroll
   * 
   * Host listener that triggers when the window is scrolled.
   * It checks the visibility of the last item in the news list.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkLastItemVisibility();
  }
}
