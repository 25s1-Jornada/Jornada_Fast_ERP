using api_erp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api_erp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsRepository _repository;

        public AnalyticsController(IAnalyticsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("movimentacao-detalhada")]
        public async Task<IActionResult> GetMovimentacaoDetalhada()
            => Ok(await _repository.GetMovimentacaoDetalhadaAsync());

        [HttpGet("pecas-qrcode-detalhadas")]
        public async Task<IActionResult> GetPecasQrCodeDetalhadas()
            => Ok(await _repository.GetPecasQrCodeDetalhadasAsync());

        [HttpGet("estoque-resumido")]
        public async Task<IActionResult> GetEstoqueResumido()
            => Ok(await _repository.GetEstoqueResumidoAsync());

        [HttpGet("armario-usuario")]
        public async Task<IActionResult> GetArmarioUsuario()
            => Ok(await _repository.GetArmarioUsuarioAsync());

        [HttpGet("movimentacao-mensal")]
        public async Task<IActionResult> GetMovimentacaoMensal()
            => Ok(await _repository.GetMovimentacaoMensalAsync());

        [HttpGet("usuarios-por-empresa")]
        public async Task<IActionResult> GetUsuariosPorEmpresa()
            => Ok(await _repository.GetUsuariosPorEmpresaAsync());

        [HttpGet("acesso-usuario")]
        public async Task<IActionResult> GetAcessoUsuario()
            => Ok(await _repository.GetAcessoUsuarioAsync());

        [HttpGet("estoque-por-armario")]
        public async Task<IActionResult> GetEstoquePorArmario()
            => Ok(await _repository.GetEstoquePorArmarioAsync());
    }
}
