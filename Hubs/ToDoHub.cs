using Microsoft.AspNetCore.SignalR;
using TodoApp.Services;

namespace TodoApp.Hubs
{
    public class ToDoHub : Hub
    {
        private readonly IToDoRepository _toDoRepository;

        public ToDoHub(IToDoRepository toDoRepository)
        {
            _toDoRepository = toDoRepository;
        }

        public async Task GetLists()
        {
            var results = await _toDoRepository.GetLists();

            await Clients.Caller.SendAsync("UpdatedToDoList", results);
        }

        public async Task GetList(int listId)
        {
            var result = await _toDoRepository.GetList(listId);

            await Clients.Caller.SendAsync("UpdatedListData", result);
        }

        // SubscribeToCountUpdates
        public async Task SubscribeToCountUpdates()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Counts");
        }

        // UnsubscribeToCountUpdates
        public async Task UnsubscribeFromCountUpdates()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Counts");
        }

        // SubscribeToListUpdates
        public async Task SubscribeToListUpdates(int listId)
        {
            var groupName = ListIdToGroupName(listId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        // UnsubscribeToListUpdates
        public async Task UnsubscribeFromListUpdates(int listId)
        {
            var groupName = ListIdToGroupName(listId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        // AddToDoItem
        public async Task AddToDoItem(int listId, string text)
        {
            await _toDoRepository.AddToDoItem(listId, text);

            // notify list count updates
            var allLists = await _toDoRepository.GetLists();
            var listUpdate = await _toDoRepository.GetList(listId);

            // notify list viewers on update
            var groupName = ListIdToGroupName(listId);
            await Clients.Group("Counts").SendAsync("UpdatedToDoList", allLists);
            await Clients.Group(groupName).SendAsync("UpdatedListData", listUpdate);
        }

        // ToggleToDoItem
        public async Task ToggleToDoItem(int listId, int itemId)
        {
            await _toDoRepository.ToggleToDoItem(listId, itemId);

            // notify list count updates
            var allLists = await _toDoRepository.GetLists();
            var listUpdate = await _toDoRepository.GetList(listId);

            // notify list viewers on update
            var groupName = ListIdToGroupName(listId);
            await Clients.Group("Counts").SendAsync("UpdatedToDoList", allLists);
            await Clients.Group(groupName).SendAsync("UpdatedListData", listUpdate);
        }


        private string ListIdToGroupName(int listId) => $"list-updates-{listId}";
    }
}
