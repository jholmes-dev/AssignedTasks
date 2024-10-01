using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository userRepository;

        public UsersController(
            IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        /// <summary>
        /// Creates a user
        /// </summary>
        /// <param name="user">The user to create</param>
        /// <returns>The created user</returns>
        [HttpPost("")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            await this.userRepository.AddAsync(user);
            return Ok(user);
        }
    }
}
