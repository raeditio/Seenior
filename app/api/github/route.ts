import { NextRequest, NextResponse } from 'next/server';
import { getCompleteRepositoryData } from './lib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }

    // Fetch complete repository data using the lib module
    const data = await getCompleteRepositoryData(url);

    // Compile response
    const response = {
      repository: data.repository,
      readme: data.readme,
      languages: data.languages,
      contributors: data.contributors,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching GitHub repository:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch repository information', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'GitHub Repository API',
      usage: 'Send a POST request with { "url": "https://github.com/owner/repo" }',
      endpoints: {
        POST: 'Fetch repository information from GitHub URL'
      }
    },
    { status: 200 }
  );
}

// Made with Bob
