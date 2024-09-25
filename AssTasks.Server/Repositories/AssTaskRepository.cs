using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Repositories
{
    public class AssTaskRepository : BaseRepository<AssTask>, IAssTaskRepository
    {
        public AssTaskRepository(
            AssTasksContext context
        ) : base(context)
        {
            //
        }
    }
}
