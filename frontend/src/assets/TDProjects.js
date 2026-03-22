const TDProjects = [
  {
    id: "1",
    name: "Taxi Rush",
    status: "In Progress",
    skills: ["Unity", "C#", "Blender", "Photoshop", "OOPs"],
    description:
      "A comprehensive taxi driver simulation game featuring real-time ride logic, economic management, and dynamic city navigation.",
    content: `
<p><strong>Taxi Rush</strong> is a <em>mobile simulation game</em> that gamifies the daily operations of a ride-hailing driver. It goes beyond simple driving mechanics to simulate the <strong>end-to-end service lifecycle</strong>, requiring players to manage <strong>time, fuel, and earnings</strong> within a realistic city economy.</p>

  <h2>Core Gameplay Loop</h2>
  <p>The game is built upon a robust <strong>GPS State Machine</strong> that mimics real-world apps like Uber or Rapido. Instead of just racing, the player engages in a strategic <em>business management loop</em> where every decision—from accepting a <strong>Ride Request</strong> to managing the <strong>Wallet Balance</strong>—impacts their ability to continue operating.</p>

  <h2>How It Works</h2>
  <ul>
      <li><strong>Ride Allocation:</strong> A real-time <em>request listener</em> generates "Quest Cards" displaying pickup distance, estimated earnings, and time-to-accept.</li>
      <li><strong>Verification Logic:</strong> The <strong>OTP Handshake</strong> system forces a <em>physical stop-and-interact</em> moment, ensuring players confirm the passenger before the meter starts.</li>
      <li><strong>Dynamic Economy:</strong> A <strong>Surge Pricing System</strong> creates <em>Heat Zones</em> on the map, rewarding players for navigating to high-demand areas during rush hours.</li>
      <li><strong>Financial Constraints:</strong> The <strong>Wallet Lock</strong> mechanism monitors the driver's <em>cash-to-digital ratio</em>, disabling new rides if the commission debt exceeds the threshold.</li>
  </ul>

  <h2>Key Features & Systems</h2>
  <ul>
      <li><strong>State Management:</strong> Distinct logic for Online, Pickup, En-Route, and Payment states</li>
      <li><strong>User Interface:</strong> Realistic notification cards with timers and route previews</li>
      <li><strong>Incentive Engine:</strong> Daily targets and quests to drive player retention</li>
      <li><strong>Frustration Mechanics:</strong> Realistic cancellation scenarios to add emotional stakes</li>
      <li><strong>Rating System:</strong> Post-ride feedback loop affecting driver reputation</li>
  </ul>

  <p>This project demonstrates complex <strong>state logic implementation</strong>, <strong>UI/UX design for simulation</strong>, and <strong>game economy balancing</strong>, creating a polished experience that mirrors the real-world gig economy. 🚖</p>
`,
  },
];

export default TDProjects;
