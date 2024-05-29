export class Mascara {
    static cpfMask(value: string): string {
      return value
        .replace(/\D/g, '') // Remove non-numeric characters
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o ponto após o terceiro dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto após o terceiro dígito
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca o hífen após os últimos dígitos
    }
  
    static phoneMask(value: string): string {
      return value
        .replace(/\D/g, '') // Remove non-numeric characters
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca o parêntese após o segundo dígito
        .replace(/(\d{5})(\d)/, '$1-$2'); // Coloca o hífen após os cinco primeiros dígitos
    }
  }
  