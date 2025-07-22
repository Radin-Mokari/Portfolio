# Interactive portfolio design

This is a Next.js project that combines a terminal-like interface with an interactive 3D hanging card.

## Features

*   **Terminal Interface**: A command-line interface for navigating through portfolio sections (about, experience, projects, etc.).
*   **Interactive 3D Card**: A dynamically loaded 3D model of an ID card with physics simulation, allowing users to drag and interact with it.
*   **Responsive Design**: The layout adapts to different screen sizes.
*   **TypeScript**: For type safety and better developer experience.
*   **Tailwind CSS**: For utility-first styling.
*   **React Three Fiber & Drei**: For rendering and managing the 3D scene.
*   **React Three Rapier**: For physics simulation of the 3D card.

## Getting Started

1.  **Clone the repository**:
    \`\`\`bash
    git clone <repository-url>
    cd interactive-portfolio-design
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Run the development server**:
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
interactive-portfolio-design/
├── app/
│   ├── favicon.ico
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── 3d-hanging-card.tsx # The interactive 3D card component
│   └── ui/                 # Shadcn UI components
│       └── ...
├── hooks/
│   └── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   ├── placeholder.svg
│   └── assets/
│       ├── 3d/
│       │   └── card.glb          # 3D badge model
│       └── images/
│           └── tag_texture.png   # Lanyard texture
├── styles/
│   └── globals.css
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## Learn More

To learn more about Next.js, take a look at the following resources:

*   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
