// Create edition record in supabase

// Fetch all editionContracts from supabase
import { supabase } from "../utils/supabaseClient";

export const fetchEditionsSupabase = async () => {
  const { data } = await supabase.from("editions").select("*");
  console.log(data);
  return data;
};

export const createEditionSupabase = async (
  contractAddress,
  name,
  symbol,
  description,
  previewImageUrl,
  animationUrl,
  editionSize,
  royaltyBPS
) => {
  try {
    const { error } = await supabase.from("editions").insert([
      {
        contractAddress: contractAddress,
        name: name,
        symbol: symbol,
        description: description,
        previewImageUrl: previewImageUrl,
        animationUrl: animationUrl,
        editionSize: editionSize,
        royaltyBPS: royaltyBPS,
      },
    ]);
    if (error) {
      throw error;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    console.log("woooo");
  }
};
