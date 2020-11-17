using Mailily.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailily.Models
{
    public class Domain
    {
        public string Website { get; set; }
        public List<EmailInfo> Emails { get; set; }
    }
}
