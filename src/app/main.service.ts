import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
// Localhost
const SERVER_URL = 'http://localhost:3000';
// AWS Server
//const SERVER_URL = 'http://9gagtest.rickcodetalk.net:3000'
const DEFAULT_HEADER = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
const DEFAULT_OPTION = new RequestOptions({ headers: DEFAULT_HEADER });
const BATCH_SIZE = 10;
const PRELOAD_SIZE = 40;

//declare var jQuery:any;

@Injectable()
export class MainService {

    constructor(private http:Http) {
    }

    private postsSubject = new Subject<any []>();
    posts$ = this.postsSubject.asObservable();

    private postCache = { ids:[], data:[] };
    //private posts = [];
    private currentBatch = 0;

    getIGPosts() {

        return new Promise( (resolve, reject) => {
                
            if(this.postCache.data.length >= ( (this.currentBatch + 1) * BATCH_SIZE)) {

                this.publishPosts();
                resolve();

                if( (this.postCache.data.length - (this.currentBatch * BATCH_SIZE) ) < PRELOAD_SIZE) {

                    this.fetchIGPosts().then();
                }

            } else {
                this.fetchIGPosts().then(
                    () => { 
                        this.publishPosts();
                        resolve();
                    },
                    err => reject(err)
                )
            }
        });
    }

    private fetchIGPosts() {

        return new Promise( (resolve, reject) => {

            let maxId = (this.postCache.data.length != 0) ? this.postCache.data[this.postCache.data.length - 1].id : 0;

            this.http.get(`${SERVER_URL}/data/posts/get?maxId=${maxId}`, DEFAULT_OPTION)
                .map(r => {
                    let j = r.json();
                    if(j.status === 'S') {

                        j.data = j.data.map(
                            item => {
                                item.caption.text = item.caption.text
                                    .replace(/@(\S*)/g,'<a href="https://www.instagram.com/$1" target="_blank">@$1</a>')
                                    .replace(/#(\S*)/g,'<a href="https://www.instagram.com/explore/tags/$1" target="_blank">#$1</a>');

                                item.creation = new Date(item.created_time * 1000);
                                return item;
                            }
                        );

                        this.processPosts(j.data);
                    }
                    return j;
                }).subscribe( 
                    () => resolve(),
                    err => reject(err)
                );
        });
    }

    private publishPosts() {
        this.postsSubject.next(this.postCache.data.slice(0, (this.postCache.data.length >= (this.currentBatch + 1) * BATCH_SIZE) ? (this.currentBatch + 1) * BATCH_SIZE : this.postCache.data.length));
        this.currentBatch++;
        
    }

    private processPosts(arr) {

        arr.forEach(x => {

            let index = this.postCache.ids.indexOf(x.id);

            if(index === -1) {

                this.postCache.ids.push(x.id);
                this.postCache.data.push(x);
            }

        });

        this.postCache.data.sort( (a, b) => {
            if(a.id > b.id) return -1;
            else if (a.id < b.id) return 1;
            else return 0;
        });

    }

    private searchById(targetId) {

        return x => x.id === targetId;
    }

}