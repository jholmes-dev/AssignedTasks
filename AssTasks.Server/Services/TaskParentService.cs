using AssTasks.Server.Models;
using AssTasks.Server.Constants;

namespace AssTasks.Server.Services
{
    public class TaskParentService
    {
        private readonly AssTasksContext _context;

        public TaskParentService(
            AssTasksContext context
        )
        {
            _context = context;
        }
    }
}
