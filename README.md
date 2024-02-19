function markdownToHtml(markdown) {
    // Replace Markdown headings with HTML headings
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Replace Markdown bold and italic text with HTML bold and italic text
    markdown = markdown.replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>');
    markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    markdown = markdown.replace(/\*(.*)\*/gim, '<em>$1</em>');

    // Replace Markdown links with HTML links
    markdown = markdown.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');

    // Replace Markdown images with HTML images
    markdown = markdown.replace(/\!\[([^\[]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />');

    // Replace Markdown unordered lists with HTML unordered lists
    markdown = markdown.replace(/^\s*\n\* (.*$)/gim, '<ul>\n<li>$1</li>\n</ul>');
    markdown = markdown.replace(/^(\*\s.*[\r\n]*)$/gim, '<ul>\n$1\n</ul>');
    markdown = markdown.replace(/^\*(.*)$/gim, '<li>$1</li>');

    // Replace Markdown ordered lists with HTML ordered lists
    markdown = markdown.replace(/^\s*\n\d\. (.*$)/gim, '<ol>\n<li>$1</li>\n</ol>');
    markdown = markdown.replace(/^(\d\.\s.*[\r\n]*)$/gim, '<ol>\n$1\n</ol>');
    markdown = markdown.replace(/^\d\.(.*)$/gim, '<li>$1</li>');

    // Replace Markdown paragraphs with HTML paragraphs
    markdown = markdown.replace(/^\s*(\n)?(.+)/gim, function (m) {
        return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
    });

    // Remove multiple consecutive newlines
    markdown = markdown.replace(/\n{2,}/gim, '\n');

    // Remove newlines at the beginning and end of the text
    markdown = markdown.replace(/^\n+|\n+$/g, '');

    return markdown.trim();
}

// Example usage:
const markdownContent = `# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text* and ***bold italic text***

- List item 1
- List item 2
- List item 3

1. Ordered item 1
2. Ordered item 2
3. Ordered item 3

[OpenAI](https://openai.com)

![Image](https://example.com/image.png)`;

const htmlContent = markdownToHtml(markdownContent);
console.log(htmlContent);
