// Simple test script for the GitHub API endpoint
// Run with: node test-api.js

const testUrl = 'https://github.com/vercel/next.js';

async function testGitHubAPI() {
  console.log('Testing GitHub API endpoint...\n');
  console.log(`Testing with URL: ${testUrl}\n`);

  try {
    const response = await fetch('http://localhost:3000/api/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: testUrl })
    });

    console.log(`Status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success! Repository data retrieved:\n');
      console.log('Repository Info:');
      console.log(`  - Name: ${data.repository.name}`);
      console.log(`  - Full Name: ${data.repository.full_name}`);
      console.log(`  - Description: ${data.repository.description}`);
      console.log(`  - Stars: ${data.repository.stargazers_count}`);
      console.log(`  - Forks: ${data.repository.forks_count}`);
      console.log(`  - Open Issues: ${data.repository.open_issues_count}`);
      console.log(`  - Default Branch: ${data.repository.default_branch}`);
      console.log(`  - License: ${data.repository.license?.name || 'None'}`);
      
      console.log('\nLanguages:');
      Object.entries(data.languages).forEach(([lang, bytes]) => {
        console.log(`  - ${lang}: ${bytes} bytes`);
      });

      console.log('\nTop Contributors:');
      data.contributors.slice(0, 5).forEach((contributor, i) => {
        console.log(`  ${i + 1}. ${contributor.login} (${contributor.contributions} contributions)`);
      });

      console.log('\nREADME Preview:');
      const readmePreview = data.readme ? data.readme.substring(0, 200) + '...' : 'No README found';
      console.log(`  ${readmePreview}`);

      console.log('\n✅ API test completed successfully!');
    } else {
      console.log('❌ Error:', data.error);
      if (data.details) {
        console.log('Details:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the development server is running (npm run dev)');
  }
}

testGitHubAPI();

// Made with Bob
