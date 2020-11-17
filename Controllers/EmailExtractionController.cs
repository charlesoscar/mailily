using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using Mailily.Contracts;
using Mailily.Services;
using Mailily.Services.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mailily.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailExtractionController : ControllerBase
    {
        private readonly IEmailExtractorService _emailExtractorService;
        public EmailExtractionController(IEmailExtractorService emailExtractorService)
        {
            _emailExtractorService = emailExtractorService;
        }

        // GET: api/EmailExtraction?website=http://www.restaurangtjornbron.se/

        [HttpGet("", Name = "Get")]
        public ActionResult<EmailResultResponse> Get([FromQuery] string website)
        {
            try
            {
                var emails = _emailExtractorService.ExtractEmailsFromWebsite(website);

                var response = new EmailResultResponse()
                {
                    Email = emails
                };

                return response;
            }
            catch (NotRespondingException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }            
        }
    }
}
