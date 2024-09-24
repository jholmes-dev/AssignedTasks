using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AssTasks.Server.Repositories
{
    public class BaseRepository<TEntity>(
        AssTasksContext context
    ) : IBaseRepository<TEntity> where TEntity : class
    {
        internal AssTasksContext context = context;
        internal DbSet<TEntity> dbSet = context.Set<TEntity>();

        /// <summary>
        /// Retrieves a set of entities by a given filter criteria. Optional OrderBy and Include statements
        /// </summary>
        /// <param name="filter">The get filter criteria</param>
        /// <param name="orderBy">The order by criteria</param>
        /// <param name="includeProperties">Any include properties</param>
        /// <returns>IEnumerable of the entity</returns>
        public virtual async Task<IEnumerable<TEntity>> GetAsync(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = ""
        ) {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return await orderBy(query).ToListAsync();
            }
            else
            {
                return await query.ToListAsync();
            }
        }

        /// <summary>
        /// Adds a given entity to the database
        /// </summary>
        /// <param name="entity">Entity to add</param>
        public virtual async Task AddAsync(TEntity entity)
        {
            await dbSet.AddAsync(entity);
            await SaveAsync();
        }

        /// <summary>
        /// Deletes an entity by Id
        /// </summary>
        /// <param name="id">The Id to delete by</param>
        /// <returns></returns>
        public virtual async Task DeleteByIdAsync(int id)
        {
            var entityToDelete = await dbSet.FindAsync(id);

            if (entityToDelete != null)
            {
                dbSet.Remove(entityToDelete);
                await SaveAsync();
            }
        }

        /// <summary>
        /// Deletes an entity by Id
        /// </summary>
        /// <param name="id">The Id to delete by</param>
        /// <returns></returns>
        public virtual async Task DeleteByCriteriaAsync(Expression<Func<TEntity, bool>> deleteCriteria)
        {
            await dbSet.Where(deleteCriteria).ExecuteDeleteAsync();
            await SaveAsync();
        }

        /// <summary>
        /// Retrieves an entity by primary key
        /// </summary>
        /// <param name="id">Primary key to search by</param>
        /// <returns></returns>
        public virtual async Task<TEntity?> GetByIdAsync(int id)
        {
            return await dbSet.FindAsync(id);
        }

        /// <summary>
        /// Retrieves all entities
        /// </summary>
        /// <param name="tracked">Whether to track entity changes</param>
        /// <returns></returns>
        public virtual async Task<List<TEntity>> GetAllAsync(bool tracked = true)
        {
            IQueryable<TEntity> query = dbSet;

            if (!tracked)
            {
                query = query.AsNoTracking();
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Updates a given entity in the database
        /// </summary>
        /// <param name="entity">The entity to update</param>
        public virtual async Task UpdateAsync(TEntity entity)
        {
            dbSet.Update(entity);
            await SaveAsync();
        }

        /// <summary>
        /// Commits changes to the database
        /// </summary>
        public virtual async Task SaveAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}