import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoserviceService} from "../services/todoservice.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  listId = -1;
  newItemText = "";
  list: any = {name: "", items: []};

  constructor(private todoService: TodoserviceService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    // @ts-ignore
    this.listId = +this.router.snapshot.paramMap.get('listId');
    this.todoService.messageThread$.subscribe((result) => {
      if (result?.message === 'updatedListData') {
        this.list = result.values;
      }
    });
    this.todoService.getListData(this.listId);
    this.todoService.subscribeToListUpdates(this.listId);
  }

  addNewItem() {
    if (this.newItemText === "") {
      return;
    }

    this.todoService.addToDoItem(this.listId, this.newItemText);
    this.newItemText = "";
  }

  toggleToDoItem(itemId: number) {
    this.todoService.toggleToDoItem(this.listId, itemId);
  }

  ngOnDestroy(): void {
    this.todoService.unsubscribeFromListUpdates(this.listId);
  }
}
