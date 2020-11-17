using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailily.Contracts
{
    public class EmailResultResponse
    {
        public List<EmailInfo> Email { get; set; }
    }
    public class EmailInfo
    {
        public Guid id { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
    }
}
