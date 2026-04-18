import { supabase } from '../lib/supabase';

async function processLatestFlyer() {
  try {
    const { data: uploads, error: uploadError } = await supabase
      .from('flyer_uploads')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (uploadError) {
      console.log('ERRO AO BUSCAR ENCARTE:', uploadError);
      return;
    }

    if (!uploads || uploads.length === 0) {
      console.log('Nenhum encarte pendente encontrado.');
      return;
    }

    const flyer = uploads[0];

    console.log('Processando encarte:', flyer.file_url);

    // SIMULAÇÃO INICIAL
    // Depois vamos trocar isso por IA lendo a imagem real
    const extractedOffers = [
      {
        product_name: 'Café União Tradicional 500g',
        category: 'Mercearia',
        price: 24.9,
        fee: 0,
        city: flyer.city || 'Volta Redonda',
        district: 'Centro',
        store_name: flyer.store_name,
      },
      {
        product_name: 'Papel Higiênico Comfy 12 unidades',
        category: 'Higiene',
        price: 9.98,
        fee: 0,
        city: flyer.city || 'Volta Redonda',
        district: 'Centro',
        store_name: flyer.store_name,
      },
      {
        product_name: 'Molho de Tomate Pramesa 300g',
        category: 'Mercearia',
        price: 2.59,
        fee: 0,
        city: flyer.city || 'Volta Redonda',
        district: 'Centro',
        store_name: flyer.store_name,
      },
    ];

    const { error: insertError } = await supabase
      .from('offers')
      .insert(extractedOffers);

    if (insertError) {
      console.log('ERRO AO INSERIR OFERTAS:', insertError);

      await supabase
        .from('flyer_uploads')
        .update({
          error_message: insertError.message,
        })
        .eq('id', flyer.id);

      return;
    }

    const { error: updateError } = await supabase
      .from('flyer_uploads')
      .update({
        status: 'processed',
        processed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq('id', flyer.id);

    if (updateError) {
      console.log('ERRO AO ATUALIZAR ENCARTE:', updateError);
      return;
    }

    console.log('Encarte processado com sucesso.');
  } catch (error) {
    console.log('ERRO GERAL:', error);
  }
}

processLatestFlyer();