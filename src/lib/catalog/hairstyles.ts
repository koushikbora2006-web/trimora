import { HairstyleCatalogItem } from '../types';

export const HAIRSTYLE_CATALOG: HairstyleCatalogItem[] = [
  {
    id: 'hs-1',
    name: 'Textured Crop',
    slug: 'textured-crop',
    description: 'A contemporary short cut with feathered, choppy texture on top and neatly faded sides. Effortlessly stylish and universally flattering.',
    category: 'Textured',
    length: 'short',
    maintenance_level: 'low-maintenance',
    styling_effort: 2,
    best_suited_face_shapes: ['oval', 'round', 'square', 'diamond'],
    aesthetic_vibes: ['trendy', 'casual'],
    suitable_hair_textures: ['straight', 'wavy', 'curly'],
    image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Apply a pea-sized amount of matte clay or sea salt spray to towel-dried hair.',
      'Use your fingertips to create piecey, deliberate texture forward and across.',
      'Allow to air-dry for a natural matte finish.'
    ],
    maintenance_notes: 'Requires a trim every 3-4 weeks to keep the fade crisp and top weight balanced.',
    recommended_products: ['Matte Texture Clay', 'Sea Salt Spray'],
    optional_beard_compatibility: 'Pairs exceptionally well with a clean short stubble or boxed beard.'
  },
  {
    id: 'hs-2',
    name: 'Classic Taper',
    slug: 'classic-taper',
    description: 'Timeless, sophisticated gentleman haircut with gradual tapering down to the neckline and natural sideburns. Professional and versatile.',
    category: 'Classic',
    length: 'short',
    maintenance_level: 'low-maintenance',
    styling_effort: 2,
    best_suited_face_shapes: ['oval', 'square', 'oblong', 'heart'],
    aesthetic_vibes: ['professional', 'traditional'],
    suitable_hair_textures: ['straight', 'wavy'],
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Comb through damp hair following natural parting line.',
      'Work a small amount of medium-shine pomade or styling cream from roots to tips.',
      'Finger-style or comb neatly for board meetings or formal evenings.'
    ],
    maintenance_notes: 'Maintains shape for 4-6 weeks with light neck-line cleanup.',
    recommended_products: ['Medium Shine Pomade', 'Styling Cream'],
    optional_beard_compatibility: 'Seamlessly flows into well-groomed stubble or a classic tailored beard.'
  },
  {
    id: 'hs-3',
    name: 'Mid Fade with Textured Top',
    slug: 'mid-fade',
    description: 'Balanced fade starting midway between temple and ear, providing crisp contrast while retaining volume and motion up top.',
    category: 'Fade',
    length: 'short',
    maintenance_level: 'medium',
    styling_effort: 3,
    best_suited_face_shapes: ['round', 'oval', 'heart', 'diamond'],
    aesthetic_vibes: ['trendy', 'casual', 'professional'],
    suitable_hair_textures: ['straight', 'wavy', 'curly', 'coily'],
    image_url: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Blow-dry hair backwards and upwards for lift at the crown.',
      'Warm styling powder or matte paste in hands and rake through top hair.',
      'Lock in position with a light touch.'
    ],
    maintenance_notes: 'Fade requires a touch-up every 2-3 weeks for razor-sharp sides.',
    recommended_products: ['Volumizing Texture Powder', 'Flexible Matte Paste'],
    optional_beard_compatibility: 'Sharp cheek line transition creates high visual definition.'
  },
  {
    id: 'hs-4',
    name: 'Low Drop Fade',
    slug: 'low-fade',
    description: 'Subtle fade hugging the ear curve and dipping low in the back. Provides clean borders without exposing too much scalp.',
    category: 'Fade',
    length: 'short',
    maintenance_level: 'medium',
    styling_effort: 2,
    best_suited_face_shapes: ['oblong', 'oval', 'diamond', 'square'],
    aesthetic_vibes: ['professional', 'casual'],
    suitable_hair_textures: ['straight', 'wavy', 'curly'],
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Leave natural movement on top or sweep slightly sideways.',
      'Hydrate with light leave-in conditioner or hair tonic.'
    ],
    maintenance_notes: 'Keeps clean aesthetic for 3 weeks.',
    recommended_products: ['Leave-in Conditioner', 'Matte Paste'],
    optional_beard_compatibility: 'Blends elegantly into faded sideburns.'
  },
  {
    id: 'hs-5',
    name: 'French Crop',
    slug: 'french-crop',
    description: 'Clean cropped fringe with clipped or faded sides. Emphasizes cheekbones and conceals receding temples or high foreheads.',
    category: 'Textured',
    length: 'short',
    maintenance_level: 'low-maintenance',
    styling_effort: 1,
    best_suited_face_shapes: ['oblong', 'oval', 'heart', 'diamond'],
    aesthetic_vibes: ['trendy', 'casual'],
    suitable_hair_textures: ['straight', 'wavy'],
    image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Towel dry hair and push fringe forward with a comb or fingers.',
      'A dab of matte paste gives subtle separation without grease.'
    ],
    maintenance_notes: 'Very easy wash-and-go morning routine; trim every 3-4 weeks.',
    recommended_products: ['Matte Putty', 'Dry Texture Spray'],
    optional_beard_compatibility: 'Accentuates masculine angles when paired with neat stubble.'
  },
  {
    id: 'hs-6',
    name: 'Modern Side Part',
    slug: 'side-part',
    description: 'Executive sophistication redefined. Sharp defined side parting with smooth taper and natural volume.',
    category: 'Classic',
    length: 'short',
    maintenance_level: 'medium',
    styling_effort: 3,
    best_suited_face_shapes: ['round', 'oval', 'square'],
    aesthetic_vibes: ['professional', 'traditional'],
    suitable_hair_textures: ['straight', 'wavy'],
    image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Use a fine-tooth comb to locate your natural diagonal hair part.',
      'Blow-dry with a round brush to build root volume on the sweep side.',
      'Finish with water-based pomade for all-day hold.'
    ],
    maintenance_notes: 'Requires stylist consultation every 4 weeks to maintain parting weight.',
    recommended_products: ['Water Soluble Pomade', 'Setting Spray'],
    optional_beard_compatibility: 'Best with clean-shaven or minimalist trimmed beard.'
  },
  {
    id: 'hs-7',
    name: 'Slick Back Undercut',
    slug: 'slick-back',
    description: 'High contrast style sweeping long crown hair smoothly back over disconnected or tapered sides. Commanding and striking.',
    category: 'Short',
    length: 'medium',
    maintenance_level: 'styling-focused',
    styling_effort: 4,
    best_suited_face_shapes: ['oval', 'square', 'diamond'],
    aesthetic_vibes: ['trendy', 'professional'],
    suitable_hair_textures: ['straight', 'wavy'],
    image_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Apply grooming tonic to wet hair and blow-dry straight back with a vented brush.',
      'Distribute high-hold clay or wax from front to crown.',
      'Comb through or finger-comb for relaxed flow.'
    ],
    maintenance_notes: 'Needs regular styling routine and trims every 3 weeks for sides.',
    recommended_products: ['High-Hold Clay Wax', 'Grooming Tonic'],
    optional_beard_compatibility: 'Pairs brilliantly with full structured beard.'
  },
  {
    id: 'hs-8',
    name: 'Curtain Hairstyle (Middle Part Flow)',
    slug: 'curtain-hairstyle',
    description: 'Iconic 90s aesthetic revived with soft modern layering. Features center or off-center parting falling gracefully along temples.',
    category: 'Medium',
    length: 'medium',
    maintenance_level: 'medium',
    styling_effort: 3,
    best_suited_face_shapes: ['oval', 'heart', 'diamond', 'square'],
    aesthetic_vibes: ['trendy', 'casual'],
    suitable_hair_textures: ['wavy', 'straight'],
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Part hair down the center when damp.',
      'Blow-dry with a diffuser or let air-dry with sea salt spray for relaxed wavy wave.',
      'Tuck edges lightly behind ears for an effortless frame.'
    ],
    maintenance_notes: 'Trims needed every 6-8 weeks to manage weight distribution.',
    recommended_products: ['Sea Salt Spray', 'Light Argan Oil Serum'],
    optional_beard_compatibility: 'Soft shadow stubble enhances relaxed romantic aesthetic.'
  },
  {
    id: 'hs-9',
    name: 'Layered Medium Flow Cut',
    slug: 'layered-medium-cut',
    description: 'Textured cut with weight removed through interior layers, providing dimension, volume, and movement for medium-length hair.',
    category: 'Medium',
    length: 'medium',
    maintenance_level: 'medium',
    styling_effort: 3,
    best_suited_face_shapes: ['square', 'round', 'oval', 'oblong'],
    aesthetic_vibes: ['casual', 'trendy'],
    suitable_hair_textures: ['wavy', 'curly', 'straight'],
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Scrunch lightweight mousse or curl cream into towel-dried lengths.',
      'Diffuse on low heat to enhance natural wave without frizz.',
      'Finish with hair oil on dry tips.'
    ],
    maintenance_notes: 'Requires shaping trim every 6-8 weeks.',
    recommended_products: ['Curl Defining Cream', 'Weightless Finishing Oil'],
    optional_beard_compatibility: 'Complements both clean shaven and natural beards.'
  },
  {
    id: 'hs-10',
    name: 'Shoulder-Length Flowing Layers',
    slug: 'shoulder-length-layers',
    description: 'Longer locks cascading gracefully with graduated face-framing layers. Radiates luxury, softness, and sophistication.',
    category: 'Long',
    length: 'long',
    maintenance_level: 'styling-focused',
    styling_effort: 4,
    best_suited_face_shapes: ['round', 'square', 'heart', 'oval'],
    aesthetic_vibes: ['casual', 'traditional', 'professional'],
    suitable_hair_textures: ['straight', 'wavy', 'curly', 'coily'],
    image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Apply heat protectant spray prior to blow-drying or heat styling.',
      'Use a large ceramic barrel brush for soft bouncy movement at ends.',
      'Hydrate weekly with a deep conditioning hair mask.'
    ],
    maintenance_notes: 'Split ends trim every 8-10 weeks; regular conditioning required.',
    recommended_products: ['Deep Moisture Hair Mask', 'Heat Protectant Spray', 'Serum'],
    optional_beard_compatibility: 'A neatly shaped, soft medium beard adds balanced symmetry.'
  },
  {
    id: 'hs-11',
    name: 'Precision Buzz Cut',
    slug: 'buzz-cut',
    description: 'Ultra-clean, uniform military-inspired short cut. Direct attention to facial bone structure and eyes with zero morning styling.',
    category: 'Short',
    length: 'short',
    maintenance_level: 'low-maintenance',
    styling_effort: 1,
    best_suited_face_shapes: ['oval', 'square', 'diamond'],
    aesthetic_vibes: ['casual', 'trendy', 'professional'],
    suitable_hair_textures: ['straight', 'wavy', 'curly', 'coily'],
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'No styling product needed.',
      'Keep scalp hydrated with lightweight moisturizer and daily SPF sunscreen.'
    ],
    maintenance_notes: 'Requires clipping every 1-2 weeks to preserve close shave length.',
    recommended_products: ['Scalp Moisturizer', 'Daily SPF 30 Scalp Sunscreen'],
    optional_beard_compatibility: 'Combines with a sculpted stubble or thick fade beard for high contrast.'
  },
  {
    id: 'hs-12',
    name: 'Tailored Crew Cut',
    slug: 'crew-cut',
    description: 'Slightly longer on front top and tapered smoothly at sides and back. The ultimate reliable, universally respected professional cut.',
    category: 'Classic',
    length: 'short',
    maintenance_level: 'low-maintenance',
    styling_effort: 2,
    best_suited_face_shapes: ['oval', 'round', 'square', 'heart'],
    aesthetic_vibes: ['professional', 'traditional'],
    suitable_hair_textures: ['straight', 'wavy'],
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    styling_tips: [
      'Rub a thumbnail of fiber or paste between palms.',
      'Push hair forward and flick the front slightly upward.',
      'Ready in under 60 seconds.'
    ],
    maintenance_notes: 'Trim every 3-4 weeks.',
    recommended_products: ['Styling Fiber', 'Matte Cream'],
    optional_beard_compatibility: 'Matches seamlessly with clean shave or tailored stubble.'
  }
];
