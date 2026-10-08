import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Braces } from "lucide-react";
import {
  Header,
  Footer,
  Code,
  InstallCommand,
  CopyButton,
} from "@/components/site";
import { repository } from "@/lib/site-config";
export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Get started with VLD. Learn schema validation, type inference, Zod migration, Mini API, and localized errors.",
};
const quickstart = `import { v } from '@oxog/vld';\n\nconst user = v.object({\n  name: v.string().min(2),\n  email: v.string().email(),\n  age: v.number().int().positive(),\n});\n\ntype User = v.infer<typeof user>;\n\nconst result = user.safeParse({\n  name: 'Alex Morgan',\n  email: 'alex@example.com',\n  age: 28,\n});\n\nif (result.success) {\n  console.log(result.data); // Typed as User\n} else {\n  console.log(result.error.issues);\n}`;
function DocsCode({ code, name }: { code: string; name: string }) {
  return (
    <div className="docs-code">
      <div className="editor-heading">
        <span>
          <Braces size={14} />
          {name}
        </span>
        <CopyButton text={code} label="code" />
      </div>
      <Code code={code} />
    </div>
  );
}
export default function DocsPage() {
  return (
    <>
      <Header />
      <main id="main" className="docs-layout container">
        <aside className="docs-sidebar">
          <span className="section-eyebrow">THE FIELD GUIDE</span>
          <a href="#start">Getting started</a>
          <a href="#schemas">Schema essentials</a>
          <a href="#inference">Type inference</a>
          <a href="#migration">Moving from Zod</a>
          <a href="#mini">The Mini API</a>
          <a href="#locales">Localization</a>
          <Link href="/playground">
            Open playground <ArrowUpRight size={14} />
          </Link>
          <a
            href={`${repository}#core-schema-api`}
            target="_blank"
            rel="noreferrer"
          >
            Full API reference <ArrowUpRight size={14} />
          </a>
        </aside>
        <article className="docs-content">
          <div className="section-eyebrow">
            A LITTLE VALIDATION. A LOT OF POSSIBILITY.
          </div>
          <h1>
            Let’s build
            <br />
            with confidence<span className="orange-text">.</span>
          </h1>
          <p className="docs-lead">
            A quick field guide to good data. Install VLD, describe your schema,
            and let TypeScript take it from there.
          </p>
          <section id="start">
            <h2>01 / Getting started</h2>
            <p>
              Install the package with your favorite package manager. VLD has
              zero third-party runtime dependencies.
            </p>
            <InstallCommand />
            <p>
              Define the shape of your data, then call <code>safeParse</code>.
              It returns a success result or structured validation issues
              without throwing.
            </p>
            <DocsCode code={quickstart} name="getting-started.ts" />
            <Link className="text-link" href="/playground">
              Run it in the playground <ArrowRight size={16} />
            </Link>
          </section>
          <section id="schemas">
            <h2>02 / Schema essentials</h2>
            <p>
              Start with primitives. Chain constraints. Compose them into
              objects and collections.
            </p>
            <DocsCode
              name="schemas.ts"
              code={`v.string().min(2).max(100);\nv.string().email();\nv.number().int().positive();\nv.boolean();\nv.enum('admin', 'user', 'guest');\nv.array(v.string()).min(1);\nv.object({ name: v.string() });\n\n// Optional values, defaults, and transformations\nv.string().optional();\nv.string().default('hello');\nv.string().transform(value => value.trim());\nv.coerce.number().parse('42'); // 42`}
            />
            <p>
              Use <code>parse</code> when you want validation to throw, or{" "}
              <code>safeParse</code> when you want to handle the result
              explicitly.
            </p>
          </section>
          <section id="inference">
            <h2>03 / One schema. One source of truth.</h2>
            <p>
              Derive your TypeScript types directly from your schemas. When a
              schema changes, its inferred type changes with it.
            </p>
            <DocsCode
              name="types.ts"
              code={`const profile = v.object({\n  username: v.string().min(3),\n  bio: v.string().optional(),\n});\n\ntype Profile = v.infer<typeof profile>;\n// { username: string; bio?: string }`}
            />
          </section>
          <section id="migration">
            <h2>04 / Already using Zod?</h2>
            <p>
              VLD exposes the familiar <code>z</code> alias and compatible entry
              points. Change your import, then run your application’s checks
              against the new package.
            </p>
            <DocsCode
              name="migration.ts"
              code={`// Before\nimport { z } from 'zod';\n\n// After\nimport { z } from '@oxog/vld';\n\n// Same familiar schema\nconst user = z.object({\n  name: z.string().min(2),\n  email: z.string().email(),\n});`}
            />
            <div className="docs-callout">
              <strong>Opt into the V2 implementation</strong>
              <p>
                For the newer method-memoization implementation, use{" "}
                <code>import {"{ vV2 as v }"} from '@oxog/vld'</code>. The V1
                factory API remains the default.
              </p>
            </div>
            <a
              href={`${repository}#drop-in-zod-compatibility`}
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              Read the compatibility notes <ArrowUpRight size={16} />
            </a>
          </section>
          <section id="mini">
            <h2>05 / Take only what you need.</h2>
            <p>
              The Mini entry point exposes standalone functions for
              bundle-conscious applications.
            </p>
            <DocsCode
              name="mini.ts"
              code={`import { object, string, number, optional }\n  from '@oxog/vld/mini';\n\nconst user = object({\n  name: string().min(2),\n  age: optional(number().positive()),\n});`}
            />
          </section>
          <section id="locales">
            <h2>06 / Clarity in every language.</h2>
            <p>
              Built-in error localization supports 27+ languages. Use a locale
              directly, or load it on demand to keep your initial bundle light.
            </p>
            <DocsCode
              name="locales.ts"
              code={`import { v, setLocale } from '@oxog/vld';\n\nsetLocale('tr');\nconst result = v.string().email().safeParse('oops');\n\n// Or load translations only when you need them\nimport { setLocaleAsync } from '@oxog/vld/locales/lazy';\nawait setLocaleAsync('ja');`}
            />
          </section>
          <div className="docs-ending">
            <h3>Ready for the deeper stuff?</h3>
            <p>
              Codecs, async refinements, plugins, result patterns, and the
              complete API live in the repository documentation.
            </p>
            <a
              href={`${repository}#readme`}
              className="button button-dark"
              target="_blank"
              rel="noreferrer"
            >
              Explore the complete reference <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
