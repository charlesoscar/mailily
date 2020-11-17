using Mailily.Services.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Mailily.Services
{
    public class EmailExtractorService : IEmailExtractorService
    {
        public List<string> ExtractEmailsFromWebsite(string website)
        {
            var content = GetContent(website);

            //got this from https://emailregex.com/
            string pattern = @"(?:[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*|""(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])";

            Regex regExpr = new Regex(pattern, RegexOptions.IgnoreCase);

            Match match = regExpr.Match(content);

            var emails = new List<string>();

            while (match.Success)
            {
                                
                if(!emails.Any(email => email == match.Groups[0].Value))
                {
                    emails.Add(match.Groups[0].Value);
                }

                match = match.NextMatch();
            }
            return emails;
        }
        public string GetContent(string website)
        {
            HttpWebResponse response = null;
            try
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(website);
                webRequest.Timeout = 10000;

                response = (HttpWebResponse)webRequest.GetResponse();

                using (Stream dataStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(dataStream);
                    return reader.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if(response != null)
                {
                    response.Close();
                }
                else
                {
                    throw new NotRespondingException();
                }
            }
        }
    }
}
