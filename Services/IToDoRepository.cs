using TodoApp.Model;

namespace TodoApp.Services
{
    public interface IToDoRepository
    {
        Task<IEnumerable<ToDoListMinimal>> GetLists();
        Task<ToDoList> GetList(int id);

        Task AddToDoItem(int listId, string text);
        Task ToggleToDoItem(int listId, int itemId);
    }
}
