﻿using System.Linq.Expressions;

namespace AssTasks.Server.Repositories.Interfaces
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        virtual Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>>? filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null, string includeProperties = "");
        Task AddAsync(TEntity entity);
        Task DeleteByIdAsync(int id);
        Task<TEntity?> GetByIdAsync(int id);
        Task<List<TEntity>> GetAllAsync(bool tracked = true);
        Task UpdateAsync(TEntity entity);
        Task SaveAsync();
    }
}
