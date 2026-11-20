# Anti-AI-Slop Design Standard

A practical design standard for creating distinctive, purposeful, accessible, and production-ready interfaces.

**Core principle:** Every design decision must serve the product, the user, or the experience. Never add visual elements simply because they look modern, trendy, or impressive.

---

## 1. Prohibited Design Defaults

Avoid these patterns unless there is a clear, product-specific reason to use them.

### Visual clichés
- Purple-to-blue gradients without a meaningful connection to the brand or product.
- Glassmorphism used as a default surface treatment.
- Excessive rounded corners, especially applying `rounded-2xl` to every component.
- Random decorative blobs, floating shapes, and abstract background elements.
- Excessive shadows, glowing borders, and unnecessary visual effects.
- Gradient text used purely for decoration.
- Gratuitous animations, parallax, and scroll-triggered effects.

### Layout clichés
- Centered hero sections followed by an automatic three-column feature grid.
- Identical card grids when the content has different relationships or priorities.
- Repeated dashboard layouts that ignore the actual information hierarchy.
- Unnecessary cards, containers, dividers, and nested surfaces.
- Excessive whitespace that makes information harder to discover.
- Sidebar navigation added simply because the interface is a SaaS product.

### Typography and iconography
- Inter as the automatic font choice for every project.
- One typography style applied uniformly across the interface.
- Emoji used as substitutes for professional product icons.
- Random combinations of icon libraries.
- Oversized headings without a clear hierarchy or purpose.
- Tiny, low-contrast text used for secondary information.

### Content and credibility
- Generic marketing copy such as "Unlock the power of...", "Revolutionize your workflow", or "Take your experience to the next level".
- Fake testimonials, fabricated customer logos, and invented metrics.
- False scarcity, unsupported claims, and misleading statistics.
- Placeholder content presented as real customer data.
- Repeated marketing language that adds no meaningful information.
- Generic labels such as "Get Started" when a more descriptive action is possible.

---

## 2. Design Decision Framework

Every major design decision must have a clear justification.

Before introducing a significant layout, component, interaction, or visual treatment, answer:

1. **User need:** What specific user need, task, or problem does this support?
2. **Design rationale:** Why is this approach appropriate for this particular product?
3. **Evidence:** What user research, product requirements, established UX patterns, or usability principles support it?
4. **Alternatives:** What reasonable alternatives were considered, and why was this approach selected?
5. **Accessibility:** Does the decision work with keyboard navigation, screen readers, contrast requirements, zoom, and reduced motion?
6. **Responsiveness:** How does the experience adapt across mobile, tablet, and desktop?
7. **Data states:** What happens when data is missing, loading, invalid, empty, or unavailable?

Do not invent research, user feedback, or evidence to justify a design decision. Clearly distinguish validated findings from assumptions.

---

## 3. Establish a Product-Specific Visual Direction

Every project must have a recognizable visual identity before detailed interface implementation begins.

First, define the product's design personality.

Possible directions include:

- **Editorial:** Typography-led, structured, content-focused, and expressive.
- **Technical:** Precise, information-dense, systematic, and functional.
- **Minimal:** Restrained, focused, and intentionally spacious.
- **Utilitarian:** Task-oriented, efficient, and optimized for frequent use.
- **Expressive:** Distinctive, energetic, and visually memorable.
- **Professional:** Trustworthy, structured, and confident.
- **Creator-focused:** Flexible, visually rich, and supportive of creative workflows.

These are starting points, not templates. A product may combine multiple directions.

### Translate the direction into design tokens

Define consistent tokens for:

- **Typography:** Font families, display, heading, body, labels, captions, and numeric styles.
- **Color:** Brand, background, surface, text, border, interactive, and semantic colors.
- **Spacing:** Consistent spacing scale based on component and layout needs.
- **Density:** Compact, comfortable, or spacious based on task frequency and information complexity.
- **Surfaces:** Background layers, borders, elevation, shadows, and separation.
- **Shapes:** Purposeful corner radii, control sizes, and component proportions.
- **Imagery:** Photography, illustrations, diagrams, product screenshots, and iconography.
- **Motion:** Duration, easing, transitions, feedback, and reduced-motion behavior.

Tokens must create consistency without forcing every component to look identical.

---

## 4. Layout and Component Selection

Choose components according to the information and interaction they represent.

- Use tables for structured, comparable information.
- Use cards when information represents independent, meaningful entities.
- Use lists for sequential or related information.
- Use dashboards only when users benefit from an overview of multiple data points.
- Use charts when they communicate a meaningful relationship, comparison, or trend.
- Use dialogs only when an interaction genuinely requires focused attention.
- Use navigation patterns appropriate to the product's information architecture.
- Prioritize clear content hierarchy over decorative composition.

### Component quality requirements

Every reusable component should define:

- Purpose and intended usage.
- Variants and sizes.
- Interaction states.
- Responsive behavior.
- Accessibility requirements.
- Content constraints.
- Empty, loading, disabled, and error behavior where applicable.

Do not create reusable components simply to enforce visual repetition where different content requires different presentation.

---

## 5. Realistic Content and Product Behavior

An interface must represent how the actual product works, not just how a polished screenshot looks.

### Content requirements
- Use realistic, contextually appropriate content.
- Use meaningful labels, descriptions, and action names.
- Maintain consistent terminology throughout the product.
- Avoid repetitive placeholder text and meaningless sample values.
- Clearly identify demo or sample data.
- Never fabricate customer information, business outcomes, or product capabilities.

### State requirements

Design and validate the following states wherever relevant:

| State | Expected behavior |
|---|---|
| Default | Clear hierarchy and available actions |
| Loading | Appropriate progress feedback without unnecessary layout shifts |
| Empty | Explain why content is absent and what the user can do |
| Error | Explain the problem and provide a recovery action |
| Success | Confirm the completed action clearly |
| Disabled | Make unavailable actions understandable |
| Partial data | Preserve useful information without misleading users |
| Offline / unavailable | Communicate limitations and recovery options |

Do not design only the ideal scenario. Consider realistic failures and edge cases.

---

## 6. Accessibility and Responsive Quality

Accessibility is a design requirement, not a final development checklist.

### Accessibility
- Maintain WCAG 2.2 AA contrast requirements where applicable.
- Never communicate meaning through color alone.
- Provide visible, consistent keyboard focus indicators.
- Support keyboard navigation and logical focus order.
- Use semantic HTML and appropriate accessible names.
- Provide meaningful labels for form controls.
- Ensure interactive targets are sufficiently large.
- Support text resizing and browser zoom without losing content or functionality.
- Respect `prefers-reduced-motion`.
- Avoid animations and interactions that create unnecessary cognitive or physical barriers.

### Responsive behavior
- Design for small screens instead of simply shrinking desktop layouts.
- Define intentional behavior for navigation, tables, forms, dialogs, and dense content.
- Prevent horizontal overflow unless the interaction genuinely requires it.
- Preserve content priority across breakpoints.
- Ensure touch, pointer, and keyboard interactions remain usable.

---

## 7. Motion and Visual Effects

Motion must communicate something meaningful.

Use animation to:
- Confirm user interactions.
- Communicate state changes.
- Establish relationships between interface elements.
- Guide attention when necessary.
- Improve transitions between related interface states.

Avoid animation that:
- Delays task completion.
- Exists only to impress.
- Repeats without a functional reason.
- Distracts from important information.
- Causes accessibility or performance problems.

Prefer subtle, purposeful motion over elaborate animation sequences.

---

## 8. Performance and Implementation Quality

Visual quality must not come at the expense of usability or performance.

- Avoid unnecessary JavaScript and animation dependencies.
- Optimize images and use appropriate image formats.
- Prevent layout shifts during loading.
- Avoid excessive DOM nesting and unnecessary component abstractions.
- Use CSS effects responsibly.
- Ensure responsive layouts do not depend on fragile positioning.
- Maintain consistency between design tokens and implementation.
- Prefer existing project conventions and components when they are appropriate.
- Do not introduce new libraries without a clear technical benefit.

---

## 9. Mandatory Design Review

Before considering an interface complete, evaluate it against these questions.

### Distinctiveness
- Could this interface belong to almost any unrelated SaaS product?
- Does its visual direction reflect the actual product?
- Are the typography, colors, layout, and imagery intentional?
- Does it avoid recognizable AI-generated design clichés?

### Usability
- Is the primary user task immediately understandable?
- Is the information hierarchy clear?
- Are actions descriptive and easy to discover?
- Are components appropriate for the information they contain?

### Credibility
- Is every metric, testimonial, logo, and claim authentic?
- Is sample data clearly identified?
- Does the interface accurately represent real product capabilities?

### Completeness
- Are all relevant states designed?
- Are error and recovery paths considered?
- Does the interface work on mobile and desktop?
- Is keyboard and screen-reader accessibility addressed?

### Implementation
- Are components consistent without being unnecessarily repetitive?
- Are design tokens used appropriately?
- Are there unnecessary visual effects or dependencies?
- Does the implementation preserve performance?

---

## 10. Final Acceptance Criteria

A design is ready for implementation or release only when:

- [ ] The visual direction is specific to the product.
- [ ] Major design decisions have clear reasoning.
- [ ] No prohibited visual patterns are used without justification.
- [ ] Typography and color establish a meaningful hierarchy.
- [ ] Layouts reflect actual content relationships.
- [ ] Components serve real user tasks.
- [ ] Content and data are realistic and trustworthy.
- [ ] Relevant interaction and data states are covered.
- [ ] Responsive behavior is intentional.
- [ ] Accessibility requirements are addressed.
- [ ] Motion and visual effects have a clear purpose.
- [ ] Performance and implementation quality are acceptable.
- [ ] The final interface feels coherent and recognizable.

**The ultimate test:**

A good interface should not look like it was generated from a popular UI template. It should look like someone understood the product, its users, and their problems before deciding how the interface should work and feel.

**Design with intention. Justify decisions. Build for real users.**