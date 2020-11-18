using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using Mailily.Contracts;
using Mailily.Contracts.Errors;
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
                var error = new Error
                {
                    Message = "The website did not respond"
                };
                return NotFound(error);
            }
            catch (Exception ex)
            {
                var error = new Error
                {
                    Message = "Something really bad happened"
                };
                return BadRequest(error);
            }            
        }
    }
}
