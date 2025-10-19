# Nautilus Trader Admin Dashboard - Documentation

Welcome to the official documentation for Nautilus Trader Admin Dashboard.

## Quick Links

- **[Home](index.md)** - Documentation home page
- **[Implementation Guide](guides/implementation-workflow.md)** - How to implement button functionality
- **[Current Sprint](tasks/current-sprint.md)** - Active tasks and progress
- **[Progress Dashboard](tasks/progress.md)** - Overall project status
- **[Version History](changelog/versions.md)** - All versions and changes

## Documentation Structure

```
docs/
├── index.md                    # Documentation home
├── guides/                     # Implementation guides
│   ├── overview.md            # Project overview
│   ├── quickstart.md          # Quick start guide
│   ├── installation.md        # Installation instructions
│   ├── implementation-workflow.md  # Technical implementation guide
│   ├── step-by-step.md        # Step-by-step tutorials
│   ├── code-examples.md       # Code examples
│   └── testing.md             # Testing guide
├── architecture/              # System architecture
│   ├── system-design.md       # Overall system design
│   ├── component-library.md   # Component library docs
│   ├── service-layer.md       # Service layer docs
│   └── data-flow.md           # Data flow patterns
├── api/                       # API reference
│   ├── services.md            # Service API reference
│   ├── components.md          # Component API reference
│   └── hooks.md               # React hooks reference
├── tasks/                     # Task management
│   ├── current-sprint.md      # Current sprint board
│   ├── backlog.md             # Backlog items
│   ├── completed.md           # Completed tasks
│   └── progress.md            # Progress tracking
└── changelog/                 # Version history
    ├── versions.md            # Version history
    └── releases.md            # Release notes
```

## Building Documentation

### Install MkDocs

```bash
pip3 install mkdocs mkdocs-material pymdown-extensions
```

### Serve Locally

```bash
cd /home/ubuntu/nautilus-trader-admin
mkdocs serve
```

Visit http://localhost:8000

### Build Static Site

```bash
mkdocs build
```

Output in `site/` directory.

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## Contributing to Documentation

1. Edit markdown files in `docs/` directory
2. Preview changes with `mkdocs serve`
3. Commit changes to Git
4. Documentation is versioned with code

## Documentation Principles

**Single Source of Truth**: This documentation is the authoritative source for all project information.

**Version Controlled**: All documentation changes are tracked in Git alongside code changes.

**Honest and Accurate**: Documentation reflects actual state, not aspirational goals.

**Always Updated**: Documentation is updated whenever code changes or requirements change.

**Task-Driven**: Work is organized by tasks with clear acceptance criteria.

## Support

For questions or issues:
- Check documentation first
- Review task boards
- Check GitHub issues
- Contact project team

---

**Last Updated**: October 19, 2025

