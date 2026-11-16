/** Site photography with intrinsic sizes, so layouts keep each image's real orientation. */
export type Img = { src: string; alt: string; width: number; height: number };

const img = (src: string, width: number, height: number) => (alt: string): Img => ({ src, alt, width, height });

export const photos = {
  house: img("/House.png", 1376, 768),
  houseStreet: img("/house_removal2.png", 1024, 1024),
  furniture: img("/House_removalist.png", 1273, 832),
  office: img("/office_removal.png", 1024, 1024),
  packing: img("/Packing.png", 1332, 908),
  packingWarehouse: img("/movera_storage.png", 1024, 1024),
  specialty: img("/special-move.png", 1148, 916),
  loading: img("/loading-unloading.png", 1418, 1066),
  fleet: img("/support-source.png", 1369, 768),
  team: img("/movera.jpeg", 1537, 1023),
};
