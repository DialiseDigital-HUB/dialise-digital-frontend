export function gerarSenhaTemporaria(): string {
  // Gera uma senha temporária aleatória de 8 caracteres (letras e números)
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let senha = ''
  for (let i = 0; i < 8; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return senha
}
