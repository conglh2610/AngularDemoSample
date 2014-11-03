using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CountriesApp.Models
{
    public class Country
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }


        [Required]
        public string Code { get; set; }

        public string Abrev { get; set; }
    }
}