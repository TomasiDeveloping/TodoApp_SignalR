import {EventEmitter, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {HubEvent} from "../models/hubEvent.model";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TodoserviceService {

  hubUrl = 'https://localhost:7014/hubs/todo';
  private hubConnection!: HubConnection;
  events!: EventEmitter<HubEvent>;
  private messageThreadSource = new BehaviorSubject<HubEvent | null>(null);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor() { }

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Trace)
      .withAutomaticReconnect()
      .withUrl(this.hubUrl)
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connected to HUB'))
      .catch(error => console.log(error));

    this.hubConnection.on('UpdatedToDoList', (values: any[]) => {
      const hubMessage: HubEvent = { message: 'updatedToDoList', values: values};
      this.messageThreadSource.next(hubMessage);
      this.hubConnection.on('UpdatedListData', (value: any) => {
        const hubMessage: HubEvent = { message: 'updatedListData', values: value};
        this.messageThreadSource.next(hubMessage);
      })
    });
  }

  getLists() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send('GetLists').then();
    } else {
      setTimeout(() => this.getLists(), 500);
    }
  }

  getListData(id: number) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send('GetList', id).then();
    } else {
      setTimeout(() => this.getListData(id), 500);
    }
  }

  subscribeToCountUpdates() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("SubscribeToCountUpdates").then();
    }
    else {
      setTimeout(() => this.subscribeToCountUpdates(), 500);
    }
  }

  unsubscribeFromCountUpdates() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("UnsubscribeFromCountUpdates").then();
    }
    else {
      setTimeout(() => this.unsubscribeFromCountUpdates(), 500);
    }
  }

  subscribeToListUpdates(id: number) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("SubscribeToListUpdates", id).then();
    }
    else {
      setTimeout(() => this.subscribeToListUpdates(id), 500);
    }
  }

  unsubscribeFromListUpdates(id: number) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("UnsubscribeFromListUpdates", id).then();
    }
    else {
      setTimeout(() => this.unsubscribeFromListUpdates(id), 500);
    }
  }

  addToDoItem(listId: number, text: string) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("AddToDoItem", listId, text).then();
    }
    else {
      setTimeout(() => this.addToDoItem(listId, text), 500);
    }
  }

  toggleToDoItem(listId: number, itemId: number) {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.send("ToggleToDoItem", listId, itemId).then();
    }
    else {
      setTimeout(() => this.toggleToDoItem(listId, itemId), 500);
    }
  }
}
