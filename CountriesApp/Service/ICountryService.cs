using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CountriesApp.Models;

namespace CountriesApp.Service
{
    public interface ICountryService
    {
        IList<Country> Get();

        PagedCollection<Country> Get(int? page, int? pageSize, string column, bool isDesc);

        Country Get(Guid Id);

        Country Add(Country agent);

        Country Update(Country agent);

        bool Remove(Guid Id);
    }
}
