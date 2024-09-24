using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Repositories
{
    public class AssTaskRepository(
        AssTasksContext context
    ) : BaseRepository<AssTask>(context), IAssTaskRepository
    {

    }
}
