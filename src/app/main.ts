import { Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

import { MainService } from './main.service';

declare var jQuery:any;

@Component({
    selector: 'main',
    templateUrl: './main.html',
    styleUrls: ['./main.css'],
    host: {
        '(window:scroll)': 'onScrollTrack($event)',
        /*
        '(window:click)': 'onClick($event)',
        */
//        '(document:drag)': 'onTest($event)',
//        '(document:mousemove)': 'onTest($event)',
//        '(document:touchmove)': 'onTest($event)',
        '(document:touchend)': 'onTouchEnd($event)',
//        '(document:touch)': 'onScrollTrack($event)',
//        '(document:dragend)': 'onTest($event)',
        
    }
})
export class Main {

    private posts = [];
    private sortBy = "creation";
    //private isLoadingOlderPosts = false;
    private isLoadingPosts = false;
    private isReady = false;

    private container;
    private scrollTop;

    constructor(private mainService:MainService, private elementRef: ElementRef) {
        
        this.mainService.posts$.subscribe(

            posts => {
                this.posts = posts;
                this.sort(true);
            }
        );

        this.getPosts().then(
            () => this.isReady = true,
            err => console.log(err)
        );

    }

    onTouchEnd($event) {

        let evt = document.createEvent("Event");
        evt.initEvent("scroll", true, true);

        document.dispatchEvent(evt);
    }

    onScrollTrack($event){

        if( (document.body.scrollTop / document.body.scrollHeight) > 0.85) {

            this.onScroll();
        }
    }

    private getPosts(isLoadingOlderPosts = false) {

        return new Promise((resolve, reject) => {
            if(!this.isLoadingPosts) {
                this.mainService.getIGPosts().then(
                    result => {
                        this.isLoadingPosts = false;
                        resolve();
                    },
                    err => {
                        this.isLoadingPosts = false;
                        console.log(err);
                        reject();
                    }
                );
            }
        });
    }

    private trackById(index: number, post:any) {         
        return post.id; 
    }

    private sort(isResort = false) {

        switch(this.sortBy) {

            case 'creation':
                this.sortByCreation(isResort);
                break;
            case 'likes':
                this.sortByLikes(isResort);
                break;
            case 'comments':
                this.sortByComments(isResort);
                break;
        }
    }

    private sortByCreation(isResort = false) {
        
        if(this.sortBy != 'creation' || isResort) {

            this.posts.sort((a, b) => b.created_time - a.created_time);
            this.sortBy = 'creation';
        }
    }

    private sortByLikes(isResort = false ) {
        if(this.sortBy != 'likes' || isResort) {

            this.posts.sort((a, b) => b.likes.count - a.likes.count);
            this.sortBy = 'likes';

        }
    }

    private sortByComments(isResort = false) {
        if(this.sortBy != 'comments' || isResort) {

            this.posts.sort((a, b) => b.comments.count - a.comments.count);
            this.sortBy = 'comments';

        }
    }

    private onScroll = this.debounce(() => { if(this.isReady) this.getPosts().then() }, 1000);
    private onScrollUp = this.debounce(() => { if(this.isReady) this.getPosts().then() }, 1000);
  
    private debounce(func, wait, immediate = undefined) {
	    var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
	    }
    }
}
