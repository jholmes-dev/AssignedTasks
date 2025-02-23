using Microsoft.EntityFrameworkCore;
using AssTasks.Server.Models;
using AssTasks.Server.Services;
using System.Text.Json.Serialization;
using AssTasks.Server.Repositories.Interfaces;
using AssTasks.Server.Repositories;
using AssTasks.Server.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var Configuration = builder.Configuration;
var AllowedOriginsPolicy = "_allowFromAngularPort";

// Add Services
builder.Services.AddScoped<IAssTaskService, AssTaskService>();
builder.Services.AddScoped<ITaskParentService, TaskParentService>();

// Add Repositories
builder.Services.AddScoped<IAssTaskRepository, AssTaskRepository>();
builder.Services.AddScoped<ITaskParentRepository, TaskParentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Allow CORS from Angular port on localhost
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowedOriginsPolicy, policy =>
    {
        policy.WithOrigins(
            "http://" + Configuration["FrontendUrl"],
            "http://www." + Configuration["FrontendUrl"]
        ).AllowAnyMethod()
         .AllowAnyHeader()
         .WithExposedHeaders("Access-Control-Allow-Headers");
    });
});

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    }
);

builder.Services.AddDbContext<AssTasksContext>(opt =>
    opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowedOriginsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
