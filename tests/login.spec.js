import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';
import { loginPage } from './pages/loginPage';
import { dashBoardPage } from './pages/dashBoardPage';

test('Não deve logar quando o código de autenticação é invalido', async ({ page }) => {
  const login = new loginPage(page)
  
  const usuario = {
    cpf:'00000014141',
    senha:'147258',
    codigo:'123456'
  }
  
  await login.acessaPagina()
  
  await login.informaCPF(usuario.cpf)

  await login.informaSenha(usuario.senha)

  await page.getByRole('textbox', { name: '000000' }).fill(usuario.codigo);
  await page.getByRole('button', { name: 'Verificar' }).click();
  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {
  
  const login = new loginPage(page)

  const dash = new dashBoardPage(page)
  
  const usuario = {
    cpf:'00000014141',
    senha:'147258',
  }
  
  await login.acessaPagina()

  await login.informaCPF(usuario.cpf)

  await login.informaSenha(usuario.senha)
  
  //Temporario
  await page.waitForTimeout(3000)
  const codigo = await obterCodigo2FA()
  
  await login.informa2FA(codigo)
  
  //Temporario
  await page.waitForTimeout(2000)

  expect(await dash.obterSaldo()).toHaveText('R$ 5.000,00')
  
});