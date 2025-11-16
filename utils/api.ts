import { Course, TeamMember, TeamData, RegistrationData, Accreditation } from '../types';

// --- Parsers ---

const parseCoursesCSV = (csvText: string): Course[] => {
  const lines = csvText.trim().replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const courses: Course[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    if (values.length !== headers.length) continue;
    
    const entry = Object.fromEntries(headers.map((header, index) => [header, values[index]]));

    const courseName = entry['CourseName'] || '';
    if (!courseName || courseName === '##') continue;

    courses.push({
      title: courseName,
      description: entry['Description'] || 'لا يوجد وصف متاح حاليًا.',
      price: Number(entry['Price (EGP)']) || 0,
      imageUrl: (entry['ImageURL'] && entry['ImageURL'] !== '##') ? entry['ImageURL'] : `https://picsum.photos/seed/${encodeURIComponent(courseName)}/600/400`,
      bookingUrl: (entry['BookingLink'] && entry['BookingLink'] !== '##') ? entry['BookingLink'] : '#',
      instructor: entry['Instructor'] || 'غير محدد',
      days: entry['days'] || 'لم يحدد بعد',
      time: entry['Time'] || 'لم يحدد بعد',
    });
  }
  return courses;
};

const parseTeamCSV = (csvText: string): TeamData => {
    const lines = csvText.trim().replace(/^\uFEFF/, '').split(/\r?\n/);
    if (lines.length < 2) return { team: [], volunteers: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const team: TeamMember[] = [];
    const volunteers: TeamMember[] = [];
    
    // Match the column headers from the user's sheet
    const nameIndex = headers.indexOf('Name');
    const jobTitleIndex = headers.indexOf('job');
    const imageUrlIndex = headers.indexOf('ImageURL'); // Re-added ImageURL support

    // Check if essential columns are present
    if (nameIndex === -1 || jobTitleIndex === -1) {
        console.error("Team sheet is missing 'Name' or 'job' columns.");
        return { team: [], volunteers: [] };
    }
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
        if (values.length !== headers.length) continue;

        const memberName = values[nameIndex] || '';
        if (!memberName || memberName === '##') continue;

        const jobTitle = values[jobTitleIndex] || 'عضو فريق';
        const imageUrlFromSheet = imageUrlIndex !== -1 ? values[imageUrlIndex] : '';
        
        const finalImageUrl = (imageUrlFromSheet && imageUrlFromSheet !== '##')
            ? imageUrlFromSheet
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=0284c7&color=fff&size=300`;

        const member: TeamMember = {
            name: memberName,
            jobTitle: jobTitle,
            imageUrl: finalImageUrl,
        };
        
        if (jobTitle.trim().toLowerCase() === 'متطوع') {
            volunteers.push(member);
        } else {
            team.push(member);
        }
    }
    return { team, volunteers };
};

const parseAccreditationsCSV = (csvText: string): Accreditation[] => {
  const lines = csvText.trim().replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const accreditations: Accreditation[] = [];
  
  const altTextIndex = headers.indexOf('AltText');
  const imageUrlIndex = headers.indexOf('ImageURL');

  if (altTextIndex === -1 || imageUrlIndex === -1) {
    console.error("Accreditations sheet is missing 'AltText' or 'ImageURL' columns.");
    return [];
  }

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    if (values.length !== headers.length) continue;
    
    const imageUrl = values[imageUrlIndex];
    if (!imageUrl || imageUrl === '##') continue;

    accreditations.push({
      altText: values[altTextIndex] || 'Accreditation Logo',
      imageUrl: imageUrl,
    });
  }
  return accreditations;
};


// --- Fetchers with Fallback ---

const G_SHEET_COURSES_URL = 'https://docs.google.com/spreadsheets/d/1UCJVyMul4YWXPx4uLtdOWKnAoruiFqsc1uj2jT_fd_M/export?format=csv&gid=0';
const G_SHEET_TEAM_URL = 'https://docs.google.com/spreadsheets/d/1lVsyzjcCx6hj9PEA8_D-_BZ__iLmvCpb1GMV7VKLfZ0/export?format=csv&gid=0';
const G_SHEET_ACCREDITATIONS_URL = 'https://docs.google.com/spreadsheets/d/1heuXIBCx1tFTp6nDpP7TEoEM_-KuLtRAg5lag0ycBJo/export?format=csv&gid=0';

const LOCAL_COURSES_URL = '/data/courses.csv';
const LOCAL_TEAM_URL = '/data/team.csv';
const LOCAL_ACCREDITATIONS_URL = '/data/accreditations.csv';


async function fetchDataWithFallback(liveUrl: string, fallbackUrl: string): Promise<string> {
    try {
        const response = await fetch(liveUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.text();
    } catch (error) {
        console.warn(`Failed to fetch live data from ${liveUrl}. Falling back to local data.`, error);
        const response = await fetch(fallbackUrl);
        if (!response.ok) throw new Error(`Failed to fetch fallback data from ${fallbackUrl}`);
        return await response.text();
    }
}

export const fetchCourses = async (): Promise<Course[]> => {
    const csvText = await fetchDataWithFallback(G_SHEET_COURSES_URL, LOCAL_COURSES_URL);
    return parseCoursesCSV(csvText);
};

export const fetchTeamData = async (): Promise<TeamData> => {
    const csvText = await fetchDataWithFallback(G_SHEET_TEAM_URL, LOCAL_TEAM_URL);
    return parseTeamCSV(csvText);
};

export const fetchAccreditations = async (): Promise<Accreditation[]> => {
    const csvText = await fetchDataWithFallback(G_SHEET_ACCREDITATIONS_URL, LOCAL_ACCREDITATIONS_URL);
    return parseAccreditationsCSV(csvText);
};

// --- Registration Submission ---
// !!! هام: استبدل هذا الرابط بالرابط الذي نسخته من Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfw8vs9k13xNE3jpWTDaC84DP2PbUnKZFPLEuTFA1OqY-ljg0E89qXfWE4uheWvqtKog/exec';

export const submitRegistration = async (data: RegistrationData): Promise<void> => {
    // FIX: Removed an obsolete check for a placeholder URL. Since GOOGLE_SCRIPT_URL is a constant,
    // the check was causing a TypeScript error and was no longer necessary.
    
    // We need to use a proxy to get around CORS issues with Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data),
    });

    // Note: With 'no-cors', we can't inspect the response body for success/error.
    // We'll have to optimistically assume it worked if the request didn't throw an error.
    // The actual success/error handling will be reflected in the Google Sheet itself.
    if (response.type === 'opaque' || response.ok) {
        return Promise.resolve();
    } else {
       // This block might not be reachable with 'no-cors' but is good practice to keep.
        throw new Error('حدث خطأ أثناء إرسال بيانات التسجيل.');
    }
};