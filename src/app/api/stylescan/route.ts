import { NextRequest, NextResponse } from 'next/server';
import { analyzeFaceImage, generateHairstyleRecommendations, validateFaceImage } from '@/lib/vision/stylescan';
import { StyleScanPreferences } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_base64, preferences, consent_given } = body;

    if (!consent_given) {
      return NextResponse.json({
        success: false,
        error: 'Explicit user consent is required before performing StyleScan face analysis.'
      }, { status: 400 });
    }

    if (!image_base64) {
      return NextResponse.json({
        success: false,
        error: 'Please upload or capture a photo to proceed with style analysis.'
      }, { status: 400 });
    }

    // Validate image format & size
    const validation = validateFaceImage(image_base64);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: validation.errorMessage
      }, { status: 400 });
    }

    const userPreferences: StyleScanPreferences = {
      length: preferences?.length || 'any',
      aesthetic: preferences?.aesthetic || 'trendy',
      maintenance: preferences?.maintenance || 'low-maintenance',
      texture: preferences?.texture || 'unknown',
      includeBeard: preferences?.includeBeard || false
    };

    // Analyze facial proportions & features
    const analysis = await analyzeFaceImage(image_base64, userPreferences);

    // Cross-match with Hairstyle Catalog
    const recommendations = generateHairstyleRecommendations(analysis, userPreferences);

    return NextResponse.json({
      success: true,
      analysis,
      preferences: userPreferences,
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
