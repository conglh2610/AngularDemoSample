using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CountriesApp.Models;
using CountriesApp.Repository;

namespace CountriesApp.Service
{
    public class CountryService : ICountryService
    {

        private readonly IRepository<Country> countryRepository;
        public CountryService(IRepository<Country> countryRepository)
        {
            this.countryRepository = countryRepository;
        }

        public IList<Country> Get()
        {
            return countryRepository.Get.ToList();
        }

        public PagedCollection<Country> Get(int? page, int? pageSize)
        {
            var currPage = page.GetValueOrDefault(0);
            var currPageSize = pageSize.GetValueOrDefault(10);

            var paged = countryRepository.Get.ToList().Skip(currPage * currPageSize)
                                .Take(currPageSize)
                                .ToArray();

            var totalCount = countryRepository.Get.Count();
            return new PagedCollection<Country>()
            {
                Page = currPage,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((decimal)totalCount / currPageSize),
                Items = paged
            };
        }

        public Country Get(Guid Id)
        {
            return countryRepository.Get.FirstOrDefault(t => t.Id.Equals(Id));
        }

        public Country Add(Country country)
        {
            country.Id = Guid.NewGuid();

            var obj = countryRepository.Add(country);
            return obj;
        }

        public Country Update(Country country)
        {
            var obj = countryRepository.Update(country);
            return obj;
        }

        public bool Remove(Guid Id)
        {
            var delete = Get(Id);
            countryRepository.Remove(delete);
            return true;
        }
    }
}