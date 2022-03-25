using TodoApp.Hubs;
using TodoApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddCors();
builder.Services.AddControllers();
//builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<IToDoRepository, InMemoryToDoRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(options =>
{
    options.AllowAnyHeader();
    options.AllowAnyMethod();
    options.AllowCredentials();
    options.WithOrigins("https://localhost:44404");
});

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ToDoHub>("hubs/todo");
});

app.UseStaticFiles();

app.MapFallbackToFile("index.html");

app.Run();
