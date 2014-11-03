using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace CountriesApp.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {

        protected DbSet<T> DbSet;
        private readonly DbContext _context;

        public Repository(DbContext context)
        {
            this._context = context;
            DbSet = context.Set<T>();
        }

        public IQueryable<T> Get
        {
            get { return DbSet; }
        }

        public IQueryable<T> GetIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> query = DbSet;
            return includeProperties.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
        }

        public T Find(object[] keyValues)
        {
            return DbSet.Find(keyValues);
        }

        public T Find(Guid id)
        {
            return DbSet.Find(id);
        }

        public T Find(string id)
        {
            return DbSet.Find(id);
        }

        public T Add(T entity)
        {
            try
            {
                DbSet.Add(entity);
                Commit();
                _context.Entry(entity).GetDatabaseValues();
            }
            catch (DbEntityValidationException)
            {
                //Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }

            return entity;
        }


        public T FindBy(T entity)
        {
            return DbSet.Find(entity);
        }

        public T Update(T entity)
        {

            var entry = _context.Entry(entity);
            entry.State = EntityState.Detached;
            if (entry.State == EntityState.Detached)
            {
                DbSet.Attach(entity);
                var vl = entry.GetValidationResult();
            }
            entry.State = EntityState.Modified;
            try
            {
                Commit();
            }
            catch (System.Data.Entity.Infrastructure.DbUpdateConcurrencyException ex)
            {
                throw ex;
            }
            return entity;
        }

        public void Commit()
        {
            _context.SaveChanges();
        }

        protected DbContext DbContext
        {
            [DebuggerStepThrough]
            get
            {
                return _context;
            }
        }
        public T AddOrUpdate(T entity)
        {
            //uses DbContextExtensions to check value of primary key
            //_context.AddOrUpdate(entity);
            Commit();
            return entity;
        }

        public void Remove(object[] keyValues)
        {
            //uses DbContextExtensions to attach a stub (or the actual entity if loaded)
            //var stub = _context.Load<T>(keyValues);
            //DbSet.Remove(stub);
            //Commit();
        }

        public void Remove(T entity)
        {
            try
            {
                DbSet.Remove(entity);
                Commit();
            }
            catch (DbEntityValidationException)
            {
                //Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }
        }

        public void Dispose(bool disposing)
        {
            if (_context != null)
            {
                _context.Dispose();
            }

            GC.SuppressFinalize(this);
        }

    }
}