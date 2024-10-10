import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from "@angular/core"
import { Observable, catchError } from "rxjs"
import { ApiConstants } from "../constants/api.constants"
import { News } from "../model/news.model"

/**
 * @service NewsService
 * 
 * The `NewsService` is an Angular service responsible for fetching news data
 * from a remote API. It provides methods to retrieve all news feeds and to
 * fetch a specific news item based on its ID.
 * 
 * @injectable {providedIn: 'root'}
 * 
 * This service is provided at the root level, making it available
 * throughout the application without needing to provide it in specific modules.
 * 
 * @import { Injectable } from '@angular/core'
 * @import { HttpClient } from '@angular/common/http'
 * @import { Observable } from 'rxjs'
 * @import { catchError } from 'rxjs'
 * @import { ApiConstants } from '../constants/api.constants'
 * @import { News } from '../model/news.model'
 */

@Injectable({
    providedIn: 'root',
  })
  export class NewsService {

    constructor(private httpClient: HttpClient) {}

    /**
   * @method getStoriesId
   * 
   * Fetches an array of all top story IDs from the API.
   * 
   * @returns {Observable<number[]>} An observable containing an array of story IDs.
   * 
   * This method uses the HTTP client to send a GET request to the API endpoint
   * defined by `ApiConstants.TOP_STORIES_END_POINT`. It pipes the response
   * to handle errors appropriately.
   */
    getStoriesId() {
      return this.httpClient
      .get<number[]>(`${ApiConstants.BASE_URL}${ApiConstants.SHOW_STORIES_END_POINT}`)
      .pipe(
        catchError((error) => {
          return error
        })
      );
    }

    /**
   * @method getStoryDetails
   * @param {number} newsId - The ID of the news item to retrieve.
   * 
   * Fetches a specific news item based on its ID.
   * 
   * @returns {Observable<News>} An observable containing the requested news item.
   * 
   * This method constructs the API URL using the provided news ID and sends a GET request
   * to retrieve the detailed information of the specific news item.
   */
    getStoryDetails(newsId: number): Observable<News> {
      return this.httpClient.get<News>(`${ApiConstants.BASE_URL}${ApiConstants.ITEM_POINT}${newsId}${ApiConstants.STORY_SUFFIX}`);
    }

  }