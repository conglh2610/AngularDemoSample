using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CountriesApp.Models;
using CountriesApp.Service;

namespace CountriesApp.Controllers
{
    public class CountryController : Controller
    {
        private readonly ICountryService countryService;

        public CountryController(ICountryService countryService)
        {
            this.countryService = countryService;
        }
        //
        // GET: /Country/
        public ActionResult Index()
        {
            //var lst = countryService.Get();
            return View();
        }

        public JsonResult GetList()
        {
            return Json(countryService.Get(), JsonRequestBehavior.AllowGet);
        }

        
        public JsonResult Get(Guid Id)
        {
            return Json(countryService.Get(Id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            return PartialView("_Create");
        }

        [HttpPost]
        public JsonResult Create(Country country)
        {
            var obj = countryService.Add(country);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Edit(Country country)
        {
            var obj = countryService.Update(country);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Guid Id)
        {
            var obj = countryService.Remove(Id);
            return Json(obj, JsonRequestBehavior.AllowGet);
        }

    }
}