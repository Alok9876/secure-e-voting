/**
 * ============================================================
 *  SECURE E-VOTING SYSTEM — DATABASE SEED FILE
 *  Run: node seed.js
 *  Seeds: Admin, Sample Voters, Elections, Candidates
 * ============================================================
 */

require('dotenv').config();
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const Voter     = require('./models/Voter');
const Election  = require('./models/Election');
const Candidate = require('./models/Candidate');
const Vote      = require('./models/Vote');

// ─── Colour helpers for console ──────────────────────────────────
const c = {
  green:  t => `\x1b[32m${t}\x1b[0m`,
  blue:   t => `\x1b[34m${t}\x1b[0m`,
  yellow: t => `\x1b[33m${t}\x1b[0m`,
  red:    t => `\x1b[31m${t}\x1b[0m`,
  bold:   t => `\x1b[1m${t}\x1b[0m`,
};

// ─────────────────────────────────────────────────────────────────
//  SEED DATA
// ─────────────────────────────────────────────────────────────────

const ADMIN = {
  name:        'System Administrator',
  email:       'admin@evoting.com',
  password:    'Admin@123',
  aadhaarNo:   'ADMIN000000000000',
  dateOfBirth: new Date('1985-06-15'),
  phone:       '9000000000',
  constituency:'Admin',
  role:        'admin',
  isVerified:  true,
  isApproved:  true,
};

const VOTERS = [
  { name: 'Rahul Kumar Verma',  email: 'rahul@example.com',  password: 'Voter@123', aadhaarNo: '1234-5678-9001', dateOfBirth: new Date('2000-03-12'), phone: '9811000001', constituency: 'North Delhi',   isVerified: true, isApproved: true },
  { name: 'Priya Sharma',       email: 'priya@example.com',  password: 'Voter@123', aadhaarNo: '1234-5678-9002', dateOfBirth: new Date('2001-07-22'), phone: '9811000002', constituency: 'South Delhi',   isVerified: true, isApproved: true },
  { name: 'Ankit Singh',        email: 'ankit@example.com',  password: 'Voter@123', aadhaarNo: '1234-5678-9003', dateOfBirth: new Date('2000-11-05'), phone: '9811000003', constituency: 'East Delhi',    isVerified: true, isApproved: true },
  { name: 'Neha Gupta',         email: 'neha@example.com',   password: 'Voter@123', aadhaarNo: '1234-5678-9004', dateOfBirth: new Date('2001-01-18'), phone: '9811000004', constituency: 'West Delhi',    isVerified: true, isApproved: true },
  { name: 'Amit Patel',         email: 'amit@example.com',   password: 'Voter@123', aadhaarNo: '1234-5678-9005', dateOfBirth: new Date('1999-09-30'), phone: '9811000005', constituency: 'Central Delhi', isVerified: true, isApproved: true },
  { name: 'Sunita Rao',         email: 'sunita@example.com', password: 'Voter@123', aadhaarNo: '1234-5678-9006', dateOfBirth: new Date('2000-05-14'), phone: '9811000006', constituency: 'North Delhi',   isVerified: true, isApproved: false }, // pending
  { name: 'Vikram Joshi',       email: 'vikram@example.com', password: 'Voter@123', aadhaarNo: '1234-5678-9007', dateOfBirth: new Date('2001-12-01'), phone: '9811000007', constituency: 'South Delhi',   isVerified: false, isApproved: false }, // unverified
];

// Elections: one closed (with results), one active, one upcoming
const ELECTIONS_TEMPLATE = [
  {
    title:        'Student Council Presidential Election 2024',
    description:  'Annual student council president election for the academic year 2024-25. All registered students are eligible to vote.',
    constituency: 'General',
    // closed election — 10 days ago
    startDate:    new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    endDate:      new Date(Date.now() - 5  * 24 * 60 * 60 * 1000),
    status:       'closed',
    candidates: [
      { name: 'Arjun Mehta',    party: 'Progressive Students Alliance', symbol: '⭐', manifesto: 'I will fight for better hostel facilities, 24/7 library access, and stronger placement support. Together we rise!', votes: 145 },
      { name: 'Divya Nair',     party: 'Students First Party',          symbol: '🌹', manifesto: 'My agenda: free WiFi across campus, mental health counselling, and transparent fee structures.', votes: 112 },
      { name: 'Ravi Tiwari',    party: 'Youth Power Movement',          symbol: '🔥', manifesto: 'Sports infrastructure, cultural events, and a new student lounge — my three core promises.', votes: 78  },
      { name: 'Pooja Iyer',     party: 'United Students Front',         symbol: '🌸', manifesto: 'Equal opportunities for all — women safety cells, scholarship drives, and green campus initiative.', votes: 65 },
    ],
  },
  {
    title:        'Department Representative Election — CSE 2025',
    description:  'Election for CSE Department Student Representative who will liaise between students and faculty for the 2025 academic year.',
    constituency: 'CSE Department',
    // active election — started 1 day ago, ends 2 days from now
    startDate:    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate:      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status:       'active',
    candidates: [
      { name: 'Karan Sharma',   party: 'Tech Forward',       symbol: '⚡', manifesto: 'Better lab hours, new GPU servers for AI projects, and inter-department hackathons every semester.', votes: 0 },
      { name: 'Sneha Verma',    party: 'Inclusive CS',        symbol: '🌊', manifesto: 'Open source workshops, industry mentorship programme, and inclusive curriculum updates.', votes: 0 },
      { name: 'Dev Patel',      party: 'Code & Grow',         symbol: '🎯', manifesto: 'Competitive programming culture, stronger alumni network, and a dedicated research fund.', votes: 0 },
    ],
  },
  {
    title:        'Annual Sports Captain Election 2025',
    description:  'Vote for your Sports Captain who will lead the university sports committee and represent students in inter-university events.',
    constituency: 'General',
    // upcoming election — starts 3 days from now
    startDate:    new Date(Date.now() + 3  * 24 * 60 * 60 * 1000),
    endDate:      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status:       'upcoming',
    candidates: [
      { name: 'Rohit Yadav',    party: 'Sports United',       symbol: '🦅', manifesto: 'New sports complex, expanded coaching staff, and an annual inter-college sports meet.', votes: 0 },
      { name: 'Anjali Dubey',   party: 'Active Campus',       symbol: '🌾', manifesto: 'Women sports quota, esports team, and yoga / fitness programmes for all students.', votes: 0 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────────────────────────

async function seed() {
  try {
    // Connect
    console.log(c.blue('\n🔗  Connecting to MongoDB…'));
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log(c.green('✅  Connected!\n'));

    // ── Wipe existing data ────────────────────────────────────────
    console.log(c.yellow('🗑   Clearing existing data…'));
    await Promise.all([
      Voter.deleteMany({}),
      Election.deleteMany({}),
      Candidate.deleteMany({}),
      Vote.deleteMany({}),
    ]);
    console.log(c.green('✅  All collections cleared.\n'));

    // ── Seed Admin ────────────────────────────────────────────────
    console.log(c.blue('👤  Creating admin account…'));
    const adminHash = await bcrypt.hash(ADMIN.password, 12);
    const admin = await Voter.create({ ...ADMIN, password: adminHash });
    console.log(c.green(`✅  Admin → ${admin.email}  /  ${ADMIN.password}`));

    // ── Seed Voters ───────────────────────────────────────────────
    console.log(c.blue('\n👥  Creating sample voters…'));
    const createdVoters = [];
    for (const v of VOTERS) {
      const hash  = await bcrypt.hash(v.password, 12);
      const voter = await Voter.create({ ...v, password: hash, role: 'voter' });
      createdVoters.push(voter);
      const statusTag = v.isApproved ? c.green('approved') : v.isVerified ? c.yellow('pending') : c.red('unverified');
      console.log(`   ${c.bold(voter.name.padEnd(22))} ${voter.email.padEnd(28)} [${statusTag}]`);
    }

    // ── Seed Elections & Candidates ───────────────────────────────
    console.log(c.blue('\n🗳️   Creating elections & candidates…'));
    for (const eData of ELECTIONS_TEMPLATE) {
      const { candidates: cData, ...electionData } = eData;

      // Create election (without candidates first)
      const election = await Election.create({
        ...electionData,
        createdBy: admin._id,
        totalVotesCast: cData.reduce((s, c) => s + (c.votes || 0), 0),
      });

      // Create candidates
      const candidateIds = [];
      for (const cd of cData) {
        const candidate = await Candidate.create({
          name:      cd.name,
          party:     cd.party,
          symbol:    cd.symbol,
          manifesto: cd.manifesto,
          voteCount: cd.votes || 0,
          election:  election._id,
        });
        candidateIds.push(candidate._id);
      }

      // Link candidates to election
      await Election.findByIdAndUpdate(election._id, { candidates: candidateIds });

      // For the closed election, create fake vote records
      if (election.status === 'closed') {
        const approvedVoters = createdVoters.filter(v => v.isApproved);
        const candidates     = await Candidate.find({ election: election._id });
        let voterIdx = 0;
        for (const cand of candidates) {
          for (let i = 0; i < cand.voteCount && voterIdx < approvedVoters.length; i++, voterIdx++) {
            const voter = approvedVoters[voterIdx];
            const ts    = Date.now() + voterIdx;
            try {
              await Vote.create({
                voter:              voter._id,
                election:           election._id,
                encryptedCandidate: require('crypto').createHash('sha256').update(`${cand._id}-${voter._id}-seed`).digest('hex'),
                receiptHash:        require('crypto').createHash('sha256').update(`${voter._id}-${election._id}-${ts}`).digest('hex'),
                timestamp:          new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
              });
              await Voter.findByIdAndUpdate(voter._id, { $addToSet: { votedElections: election._id } });
            } catch { /* skip duplicate */ }
          }
        }
      }

      const statusEmoji = { closed: '🔴', active: '🟢', upcoming: '🔵' }[election.status];
      console.log(`   ${statusEmoji} ${c.bold(election.title)}`);
      for (const cd of cData) {
        console.log(`      └─ ${cd.symbol} ${cd.name.padEnd(20)} (${cd.party}) — ${cd.votes} votes`);
      }
    }

    // ── Summary ───────────────────────────────────────────────────
    const counts = {
      voters:     await Voter.countDocuments({ role: 'voter' }),
      elections:  await Election.countDocuments(),
      candidates: await Candidate.countDocuments(),
      votes:      await Vote.countDocuments(),
    };

    console.log(c.bold(c.green('\n══════════════════════════════════')));
    console.log(c.bold(c.green('  🌱  DATABASE SEEDED SUCCESSFULLY  ')));
    console.log(c.bold(c.green('══════════════════════════════════')));
    console.log(`  👥 Voters:     ${counts.voters}`);
    console.log(`  🗳️  Elections:  ${counts.elections}`);
    console.log(`  🧑 Candidates: ${counts.candidates}`);
    console.log(`  ✅ Votes:      ${counts.votes}`);
    console.log(c.bold('\n  🔑 Login credentials:'));
    console.log(`  Admin  → admin@evoting.com    / Admin@123`);
    console.log(`  Voter  → rahul@example.com    / Voter@123`);
    console.log(`  Voter  → priya@example.com    / Voter@123`);
    console.log(c.bold('\n  📌 Important:'));
    console.log('  • Sunita Rao  — PENDING approval (test approve flow)');
    console.log('  • Vikram Joshi — UNVERIFIED (test email verify flow)');
    console.log('  • Closed election has 400 sample votes with results ready\n');
    console.log(c.yellow('  Run: node server.js   to start the server\n'));

    process.exit(0);
  } catch (err) {
    console.error(c.red('\n❌  Seed failed:'), err.message);
    process.exit(1);
  }
}

seed();
