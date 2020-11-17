using Mailily.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mailily.Services
{
    public interface IEmailExtractorService
    {
        List<EmailInfo> ExtractEmailsFromWebsite(string website);
    }
}
