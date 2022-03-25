import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoserviceService} from "../services/todoservice.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy{

  lists: any[] = [];

  constructor(private todoService: TodoserviceService) {
  }

  ngOnInit(): void {
    this.todoService.createHubConnection();
    this.todoService.messageThread$.subscribe((result) => {
      console.log(result);
      if (result?.message === 'updatedToDoList') {
        this.lists = result?.values;
      }
    })
    this.todoService.getLists();
    this.todoService.subscribeToCountUpdates();
  }

  ngOnDestroy(): void {
    this.todoService.unsubscribeFromCountUpdates();
  }
}
