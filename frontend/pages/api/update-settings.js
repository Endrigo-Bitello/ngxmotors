import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Verifique se os dados estão sendo recebidos corretamente
    console.log(req.body);

    // Pegando todos os campos que podem ser enviados
    const {
      taxaString,
      taxaValue,
      address,
      whatsappNumber,
      phoneNumber,
      email,
      name,
      instagramUrl,
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      tiktokUrl,
      openingHours,
      whatsappMessage,
      city,
      googleMaps,
      websiteUrl,
      slogan,
      about,
    } = req.body;

    try {
      // Caminho para o arquivo .env
      const envPath = path.join(process.cwd(), '.env');

      // Ler o conteúdo atual do arquivo .env
      let envContent = fs.readFileSync(envPath, 'utf-8');

      // Função auxiliar para substituir a linha somente se o valor estiver presente
      const updateEnvVariable = (regex, newValue) => {
        if (newValue) {
          envContent = envContent.replace(regex, newValue);
        }
      };

      // Substituir os valores existentes somente se os valores foram passados
      updateEnvVariable(/NEXT_PUBLIC_SETTINGS_TAXA_STRING=".*"/, `NEXT_PUBLIC_SETTINGS_TAXA_STRING="${taxaString}"`);
      updateEnvVariable(/NEXT_PUBLIC_SETTINGS_TAXA_VALUE=.*/, `NEXT_PUBLIC_SETTINGS_TAXA_VALUE=${taxaValue}`);
      updateEnvVariable(/NEXT_PUBLIC_ADDRESS=".*"/, `NEXT_PUBLIC_ADDRESS="${address}"`);
      updateEnvVariable(/NEXT_PUBLIC_WHATSAPP_NUMBER=.*/, `NEXT_PUBLIC_WHATSAPP_NUMBER=${whatsappNumber}`);
      updateEnvVariable(/NEXT_PUBLIC_PHONE_NUMBER=.*/, `NEXT_PUBLIC_PHONE_NUMBER="${phoneNumber}"`);
      updateEnvVariable(/NEXT_PUBLIC_EMAIL=".*"/, `NEXT_PUBLIC_EMAIL="${email}"`);
      updateEnvVariable(/NEXT_PUBLIC_NAME=".*"/, `NEXT_PUBLIC_NAME="${name}"`);
      updateEnvVariable(/NEXT_PUBLIC_INSTAGRAM_URL=".*"/, `NEXT_PUBLIC_INSTAGRAM_URL="${instagramUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_FACEBOOK_URL=".*"/, `NEXT_PUBLIC_FACEBOOK_URL="${facebookUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_TWITTER_URL=".*"/, `NEXT_PUBLIC_TWITTER_URL="${twitterUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_LINKEDIN_URL=".*"/, `NEXT_PUBLIC_LINKEDIN_URL="${linkedinUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_TIKTOK_URL=".*"/, `NEXT_PUBLIC_TIKTOK_URL="${tiktokUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_OPENING_HOURS=".*"/, `NEXT_PUBLIC_OPENING_HOURS="${openingHours}"`);
      updateEnvVariable(/NEXT_PUBLIC_WHATSAPP_MESSAGE=".*"/, `NEXT_PUBLIC_WHATSAPP_MESSAGE="${whatsappMessage}"`);
      updateEnvVariable(/NEXT_PUBLIC_CITY=".*"/, `NEXT_PUBLIC_CITY="${city}"`);
      updateEnvVariable(/NEXT_PUBLIC_GOOGLE_MAPS=".*"/, `NEXT_PUBLIC_GOOGLE_MAPS="${googleMaps}"`);
      updateEnvVariable(/NEXT_PUBLIC_WEBSITE_URL=".*"/, `NEXT_PUBLIC_WEBSITE_URL="${websiteUrl}"`);
      updateEnvVariable(/NEXT_PUBLIC_SLOGAN=".*"/, `NEXT_PUBLIC_SLOGAN="${slogan}"`);
      updateEnvVariable(/NEXT_PUBLIC_ABOUT=".*"/, `NEXT_PUBLIC_ABOUT="${about}"`);

      // Escrever o novo conteúdo de volta ao arquivo .env
      fs.writeFileSync(envPath, envContent, 'utf-8');

      return res.status(200).json({ message: 'Configurações atualizadas com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar o arquivo .env:', error);
      return res.status(500).json({ message: 'Erro ao atualizar configurações' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
