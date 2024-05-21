import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { resources } from "app/drizzle/schema.server";

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { doTheAuthThing } from "lib/authThing";
import { Button } from "~/components/ui/button";
import { IoArrowBack } from "react-icons/io5";

// This function fetches resources from D1 and images from R2
export async function loader({ request, context }: LoaderFunctionArgs) {
  // call this at the top of all your loaders that need auth and db
  const { user, session, db } = await doTheAuthThing({ request, context });
  // now you just have to condition all these queires on the user id
  if (user) {
    const userId = user.id;
    console.log("LOGGED IN!!");
    //      ^ type: string
  } else {
    console.log("NOT LOGGED IN!!");
    return redirect("/login");
  }
  const resourceList = await db
    .select({
      id: resources.id,
      title: resources.title,
      href: resources.href,
    })
    .from(resources)
    .orderBy(resources.id);

  //   console.log(await S3.send(new ListObjectsV2Command({ Bucket: "artworks" })));
  return json({
    resourceList,
  });
}

export default function Select() {
  const { resourceList } = useLoaderData<typeof loader>();
  const years = [
    { id: 1, name: "Frosh" },
    { id: 2, name: "Sophomore" },
    { id: 3, name: "Junior" },
    { id: 4, name: "Senior" },
  ];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="max-h-screen flex flex-col items-center">
      <div className="flex flex-row w-full justify-between items-center pt-16 sm:pt-24">
        <Button onClick={handleClick}>
          <IoArrowBack className="text-xl" />
          <h2 className="hidden sm:flex">Back</h2>
        </Button>
        <h1 className="text-4xl font-bold absolute left-1/2 transform -translate-x-1/2">
          Select a Year
        </h1>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 pt-8 sm:pt-16">
        {years.map((year) => (
          <Link
            key={year.id}
            to={`/app/${year.name.toLowerCase()}`}
            className="bg-white p-12 sm:p-24 rounded shadow-md flex items-center justify-center"
          >
            <h2 className="text-xl font-semibold">{year.name}</h2>
          </Link>
        ))}
      </div>

      {/* <ul>
          {imageList.map((url, index) => (
            <li key={index}>
              <img
                src={url}
                alt={`Artwork ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </li>
          ))}
        </ul> */}
      {/* <Form method="post" encType="multipart/form-data">
          <div>
            <label>
              Upload Image: <input type="file" name="image" required />
            </label>
          </div>
          <button type="submit">Upload</button>
        </Form>
        <ul>
          {resourceList.map((resource) => (
            <li key={resource.id}>
              <a target="_blank" href={resource.href} rel="noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
        <Form method="POST">
          <div>
            <label>
              Title: <input type="text" name="title" required />
            </label>
          </div>
          <div>
            <label>
              URL: <input type="url" name="href" required />
            </label>
          </div>
          <button type="submit">Add Resource</button>
        </Form> */}
    </div>
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const db = drizzle(context.cloudflare.env.DB);

  // Handle resource addition
  const title = formData.get("title");
  const href = formData.get("href");
  if (title && href) {
    await db
      .insert(resources)
      .values({ title: title as string, href: href as string })
      .execute();
    return json({ message: "Resource added" }, { status: 201 });
  }

  return json({ message: "No operation performed" }, { status: 400 });
}
