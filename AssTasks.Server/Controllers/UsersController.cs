using AssTasks.Server.Models;
using AssTasks.Server.Repositories;
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
        /// Retrieves all users
        /// </summary>
        /// <returns>A list of user objects</returns>
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(
                await userRepository.GetAllAsync()
            );
        }

        /// <summary>
        /// Creates a user
        /// </summary>
        /// <param name="user">The user to create</param>
        /// <returns>The created user</returns>
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            await this.userRepository.AddAsync(user);
            return Ok(user);
        }

        /// <summary>
        /// Delete a User by Id
        /// </summary>
        /// <param name="id">The User Id to delete by</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await userRepository.DeleteByIdAsync(id);
            return NoContent();
        }
    }
}
