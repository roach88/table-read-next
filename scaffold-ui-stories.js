const fs = require("fs");
const path = require("path");

const uiDir = path.join(__dirname, "src", "components", "ui");

function toPascalCase(str) {
  return str
    .replace(/(^|[-_])(\w)/g, (_, __, c) => (c ? c.toUpperCase() : ""))
    .replace(/\.tsx$/, "");
}

// Map of component base names to custom story renderers
const customStories = {
  Pagination: `import type { Meta, StoryObj } from '@storybook/react';\nimport { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from './pagination';\n\nconst meta: Meta<typeof Pagination> = {\n  title: 'UI/Pagination',\n  component: Pagination,\n  tags: ['autodocs'],\n};\nexport default meta;\n\ntype Story = StoryObj<typeof Pagination>;\n\nexport const Default: Story = {\n  render: () => (\n    <Pagination>\n      <PaginationContent>\n        <PaginationItem><PaginationPrevious /></PaginationItem>\n        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>\n        <PaginationItem><PaginationEllipsis /></PaginationItem>\n        <PaginationItem><PaginationNext /></PaginationItem>\n      </PaginationContent>\n    </Pagination>\n  ),\n};\n`,
  Accordion: `import type { Meta, StoryObj } from '@storybook/react';\nimport { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';\n\nconst meta: Meta<typeof Accordion> = {\n  title: 'UI/Accordion',\n  component: Accordion,\n  tags: ['autodocs'],\n};\nexport default meta;\n\ntype Story = StoryObj<typeof Accordion>;\n\nexport const Default: Story = {\n  render: () => (\n    <Accordion type="single" collapsible>\n      <AccordionItem value="item-1">\n        <AccordionTrigger>Section 1</AccordionTrigger>\n        <AccordionContent>Content for section 1</AccordionContent>\n      </AccordionItem>\n      <AccordionItem value="item-2">\n        <AccordionTrigger>Section 2</AccordionTrigger>\n        <AccordionContent>Content for section 2</AccordionContent>\n      </AccordionItem>\n    </Accordion>\n  ),\n};\n`,
  Tabs: `import type { Meta, StoryObj } from '@storybook/react';\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';\n\nconst meta: Meta<typeof Tabs> = {\n  title: 'UI/Tabs',\n  component: Tabs,\n  tags: ['autodocs'],\n};\nexport default meta;\n\ntype Story = StoryObj<typeof Tabs>;\n\nexport const Default: Story = {\n  render: () => (\n    <Tabs defaultValue="tab1">\n      <TabsList>\n        <TabsTrigger value="tab1">Tab 1</TabsTrigger>\n        <TabsTrigger value="tab2">Tab 2</TabsTrigger>\n      </TabsList>\n      <TabsContent value="tab1">Content 1</TabsContent>\n      <TabsContent value="tab2">Content 2</TabsContent>\n    </Tabs>\n  ),\n};\n`,
  // Add more custom stories for other complex components as needed
};

fs.readdirSync(uiDir).forEach((file) => {
  if (
    file.endsWith(".tsx") &&
    !file.endsWith(".stories.tsx") &&
    !file.startsWith("index")
  ) {
    const base = file.replace(".tsx", "");
    const storyFile = path.join(uiDir, `${base}.stories.tsx`);
    if (fs.existsSync(storyFile)) return;
    const componentName = toPascalCase(base);
    if (customStories[componentName]) {
      fs.writeFileSync(storyFile, customStories[componentName]);
      console.log(`Created (custom): ${storyFile}`);
    } else {
      const story = `import type { Meta, StoryObj } from '@storybook/react';\nimport { ${componentName} } from './${base}';\n\nconst meta: Meta<typeof ${componentName}> = {\n  title: 'UI/${componentName}',\n  component: ${componentName},\n  tags: ['autodocs'],\n};\nexport default meta;\n\ntype Story = StoryObj<typeof ${componentName}>;\n\nexport const Default: Story = {\n  args: {},\n};\n`;
      fs.writeFileSync(storyFile, story);
      console.log(`Created: ${storyFile}`);
    }
  }
});

console.log("✅ Story scaffolding complete!");
