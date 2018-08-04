package hello;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/greeting")
    @CrossOrigin(origins = "http://localhost:4200")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name, @RequestParam(value="pass", defaultValue = "") String password) {
        if(!password.equals("hola")){
            return new Greeting(-1,"Error al iniciar sesión: " + name);
        }else{
            return new Greeting(counter.incrementAndGet(),
                    String.format(template, name));
        }
    }
}