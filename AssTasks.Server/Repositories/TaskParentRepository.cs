using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Repositories
{
    public class TaskParentRepository : BaseRepository<TaskParent>, ITaskParentRepository
    {
        public TaskParentRepository(AssTasksContext context) : base(context)
        {
        }
    }
}
