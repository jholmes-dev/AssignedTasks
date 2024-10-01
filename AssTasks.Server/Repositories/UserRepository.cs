using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(
            AssTasksContext context
        ) : base(context)
        {
            //
        }
    }
}
